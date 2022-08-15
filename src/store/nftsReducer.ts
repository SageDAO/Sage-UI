import { BigNumber, ContractTransaction, ethers, Signer } from 'ethers';
import {
  approveERC20Transfer,
  getMarketplaceContract,
  getNFTContract,
  getNftFactoryContract,
} from '@/utilities/contracts';
import { createBucketName, uploadFileToS3Bucket } from '@/utilities/awsS3';
import { copyFromS3toArweave, createNftMetadataOnArweave } from '@/utilities/arweave';
import { CollectedListingNft, Nft_include_NftContractAndOffers } from '@/prisma/types';
import { toast } from 'react-toastify';
import { playErrorSound, playTxSuccessSound } from '@/utilities/sounds';
import { Offer } from '@prisma/client';
import { baseApi } from './baseReducer';

export interface MintRequest {
  name: string;
  description: string;
  tags: string;
  price: number;
  isFixedPrice: boolean;
  file: File;
  signer: Signer;
}

export interface OfferRequest {
  nftId: number;
  nftContractAddress: string;
  amount: number;
  signer: Signer;
  signedOffer?: string;
  expiresAt?: Date;
}

export const nftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListingNftsByArtist: builder.query<Nft_include_NftContractAndOffers[], string>({
      query: (artistAddress: string) =>
        `nfts?action=GetListingNftsByArtist&address=${artistAddress}`,
      providesTags: ['Nfts'],
    }),
    getListingNftsByOwner: builder.query<CollectedListingNft[], void>({
      query: () => `nfts?action=GetListingNftsByOwner`,
      providesTags: ['Nfts'],
    }),
    fetchOrCreateNftContract: builder.query<string, { artistAddress: string; signer: Signer }>({
      queryFn: async ({ artistAddress, signer }, { dispatch }, _, fetchWithBQ) => {
        try {
          const contractAddress = await _fetchOrCreateNftContract(
            artistAddress,
            signer,
            fetchWithBQ
          );
          return { data: contractAddress };
        } catch (e) {
          console.log(e);
          return { data: 'false' };
        }
      },
    }),
    mintSingleNft: builder.mutation<number, MintRequest>({
      queryFn: async (mintRequest, { dispatch }, _, fetchWithBQ) => {
        var nftId = 0;
        try {
          const endpoint = '/api/dropUploadEndpoint/';
          const artistAddress = await mintRequest.signer.getAddress();
          const nftContractAddress = await _fetchOrCreateNftContract(
            artistAddress,
            mintRequest.signer,
            fetchWithBQ
          );
          const { s3Path, metadataPath } = await uploadToAwsAndArweave(mintRequest, endpoint);
          nftId = await dbInsertNft(mintRequest, artistAddress, s3Path, metadataPath, fetchWithBQ);
          console.log(`mintSingleNft() :: Minting on NFT Contract ${nftContractAddress}...`);
          const nftContract = await getNFTContract(nftContractAddress, mintRequest.signer);
          const mintTx = await nftContract.artistMint(artistAddress, nftId, metadataPath);
          await mintTx.wait();
          if (mintRequest.isFixedPrice) {
            await createSignedOffer(
              nftContractAddress,
              nftId,
              mintRequest.price,
              mintRequest.signer,
              true,
              fetchWithBQ
            );
          }
          return { data: nftId };
        } catch (e) {
          console.log(e);
          if (nftId && nftId != 0) {
            console.log(`mintSingleNft() :: Deleting NFT...`);
            await fetchWithBQ(`dropUploadEndpoint?action=DeleteNft&id=${nftId}`);
          }
          return { data: 0 };
        }
      },
      invalidatesTags: ['Nfts'],
    }),
    buyFromSellOffer: builder.mutation<boolean, { sellOffer: Offer; signer: Signer }>({
      queryFn: async ({ sellOffer, signer }, { dispatch }, _, fetchWithBQ) => {
        const marketplaceContract = await getMarketplaceContract(signer);
        const weiPrice = ethers.utils.parseEther(sellOffer.price.toString());
        try {
          const tokenAddress = await marketplaceContract.token();
          await approveERC20Transfer(tokenAddress, marketplaceContract.address, weiPrice, signer);
        } catch (e) {
          console.error(e);
          toast.error(`Error approving transfer`);
          playErrorSound();
          return { data: false };
        }
        try {
          console.log(
            `buyFromSellOffer(${sellOffer.signer}, ${sellOffer.nftContractAddress}, ${weiPrice}, ${sellOffer.nftId}, ${sellOffer.expiresAt}, ${sellOffer.signedOffer}`
          );
          const tx = await marketplaceContract.buyFromSellOffer(
            sellOffer.signer,
            sellOffer.nftContractAddress,
            weiPrice,
            sellOffer.nftId,
            sellOffer.expiresAt,
            sellOffer.signedOffer
          );
          toast.promise(tx.wait(), {
            pending: 'Request submitted to the blockchain, awaiting confirmation...',
            success: `Success! You've bought an NFT!`,
            error: 'Failure! Unable to complete request.',
          });
          await tx.wait(1);
          await fetchWithBQ(`nfts?action=UpdateOwner&id=${sellOffer.id}`);
          playTxSuccessSound();
          return { data: true };
        } catch (e) {
          console.log(e);
          toast.error('Error buying NFT');
          return { data: false };
        }
      },
      invalidatesTags: ['Nfts'],
    }),
    createBuyOffer: builder.mutation<null, OfferRequest>({
      queryFn: async (offer, { dispatch }, _, fetchWithBQ) => {
        try {
          const weiAmount = ethers.utils.parseEther(offer.amount.toString());
          const marketplaceContract = await getMarketplaceContract(offer.signer);
          const tokenAddress = await marketplaceContract.token();
          await approveERC20Transfer(
            tokenAddress,
            marketplaceContract.address,
            weiAmount,
            offer.signer
          );
          // TODO verify if ASH balance covers the buy offer
          await createSignedOffer(
            offer.nftContractAddress,
            offer.nftId,
            offer.amount,
            offer.signer,
            false,
            fetchWithBQ
          );
          toast.success(
            `Success! You've placed an offer of ${offer.amount} for this NFT. We'll let you know if the artist accepts it!`
          );
        } catch (e) {
          console.error(e);
          toast.error(`Error placing offer`);
          playErrorSound();
        }
        return { data: null };
      },
      invalidatesTags: ['Nfts'],
    }),
  }),
});

async function uploadToAwsAndArweave(mintRequest: MintRequest, endpoint: string) {
  console.log(`uploadToAwsAndArweave() :: Uploading media to AWS S3...`);
  const s3Path = await uploadFileToS3Bucket(
    endpoint,
    createBucketName(),
    mintRequest.file.name,
    mintRequest.file
  );
  console.log(`uploadToAwsAndArweave() :: Uploading media to Arweave...`);
  const ipfsPath = await copyFromS3toArweave(endpoint, s3Path);
  console.log(`uploadToAwsAndArweave() :: Uploading metadata to Arweave...`);
  const metadataPath = await createNftMetadataOnArweave(
    endpoint,
    mintRequest.name,
    mintRequest.description,
    ipfsPath,
    mintRequest.file.name.toLowerCase().endsWith('mp4')
  );
  return { s3Path, metadataPath };
}

async function dbInsertNft(
  mintRequest: MintRequest,
  artistAddress: string,
  s3Path: string,
  metadataPath: string,
  fetchWithBQ: any
) {
  console.log(`dbInsertNft() :: Creating database record...`);
  const { data } = await fetchWithBQ({
    url: `dropUploadEndpoint?action=InsertNft`,
    method: 'POST',
    body: {
      artistAddress,
      name: mintRequest.name,
      description: mintRequest.description,
      tags: mintRequest.tags,
      price: mintRequest.price,
      s3Path,
      metadataPath,
      numberOfEditions: 1,
    },
  });
  const nftId = (data as any).nftId;
  if (!nftId || nftId == 0) {
    throw new Error('Failed inserting NFT into database');
  }
  console.log(`dbInsertNft() :: Database NFT ID = ${nftId}`);
  return nftId;
}

async function createSignedOffer(
  nftContractAddress: string,
  nftId: number,
  amount: number,
  signer: Signer,
  isSellOffer: boolean,
  fetchWithBQ: any
) {
  const weiAmount = ethers.utils.parseEther(amount.toString());
  var { signedOffer, expiresAt } = await signOffer(
    nftContractAddress,
    nftId,
    weiAmount,
    signer,
    isSellOffer
  );
  const { data } = await fetchWithBQ({
    url: `nfts?action=CreateOffer`,
    method: 'POST',
    body: {
      signer: await signer.getAddress(),
      nftContractAddress,
      price: amount,
      nftId,
      expiresAt,
      signedOffer,
      isSellOffer,
    },
  });
  const id = parseInt((data as any).id);
  if (isNaN(id)) {
    throw new Error('Failed inserting offer into database');
  }
  console.log(`createSignedOffer() :: Database Offer ID = ${id}`);
}

async function signOffer(
  nftContractAddress: string,
  nftId: number,
  weiPrice: BigNumber,
  signer: Signer,
  isSellOffer: boolean
): Promise<{ signedOffer: string; expiresAt: number }> {
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const expiresAt = Math.floor(oneYearFromNow.getTime() / 1000);
  const signerAddress = await signer.getAddress();
  const message = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'uint256', 'uint256', 'bool'],
    [signerAddress, nftContractAddress, weiPrice, nftId, expiresAt, true]
  );
  const encodedMessage = ethers.utils.keccak256(message);
  const signedOffer = await signer.signMessage(ethers.utils.arrayify(encodedMessage));
  console.log(
    `signOffer(${signerAddress}, ${nftContractAddress}, ${weiPrice}, ${nftId}, ${expiresAt}, ${isSellOffer}) :: ${signedOffer}`
  );
  return { signedOffer, expiresAt };
}

export async function _fetchOrCreateNftContract(
  artistAddress: string,
  signer: Signer,
  fetchWithBQ: any
): Promise<string> {
  const { data } = await fetchWithBQ(`drops?action=GetNftContractAddress&address=${artistAddress}`);
  if (data.contractAddress) {
    console.log(
      `_fetchOrCreateNftContract() :: Found existing NFT contract in database at ${data.contractAddress}`
    );
    return data.contractAddress;
  }
  const nftFactoryContract = await getNftFactoryContract(signer);
  console.log(`_fetchOrCreateNftContract() :: Using Factory ${nftFactoryContract.address}`);
  var artistContractAddress = await nftFactoryContract.getContractAddress(artistAddress);
  if (!artistContractAddress || artistContractAddress == ethers.constants.AddressZero) {
    console.log(`_fetchOrCreateNftContract() :: Creating new NFT contract...`);
    var tx: ContractTransaction;
    if (artistAddress == (await signer.getAddress())) {
      tx = await nftFactoryContract.deployByArtist('Sage', 'SAGE');
    } else {
      tx = await nftFactoryContract.deployByAdmin(artistAddress, 'Sage', 'SAGE');
    }
    await tx.wait(1);
    artistContractAddress = await nftFactoryContract.getContractAddress(artistAddress);
    if (artistContractAddress == ethers.constants.AddressZero) {
      throw new Error('Unable to create a new NFT contract');
    }
  }
  await fetchWithBQ(
    `drops?action=UpdateNftContractAddress&artistAddress=${artistAddress}&contractAddress=${artistContractAddress}`
  );
  console.log(`_fetchOrCreateNftContract() :: Contract deployed to ${artistContractAddress}`);
  return artistContractAddress;
}

export const {
  useGetListingNftsByArtistQuery,
  useGetListingNftsByOwnerQuery,
  useFetchOrCreateNftContractQuery,
  useMintSingleNftMutation,
  useBuyFromSellOfferMutation,
  useCreateBuyOfferMutation,
} = nftsApi;
