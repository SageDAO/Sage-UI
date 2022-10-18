import { BigNumber, ContractTransaction, ethers, Signer } from 'ethers';
import {
  approveERC20Transfer,
  extractErrorMessage,
  getMarketplaceContract,
  getNFTContract,
  getNftFactoryContract,
} from '@/utilities/contracts';
import { createBucketFolderName, uploadFileToS3 } from '@/utilities/awsS3-client';
import { copyFromS3toArweave, createNftMetadataOnArweave } from '@/utilities/arweave-client';
import { CollectedListingNft, Nft_include_NftContractAndOffers } from '@/prisma/types';
import { toast } from 'react-toastify';
import { Offer } from '@prisma/client';
import { baseApi } from './baseReducer';
import { promiseToast } from '@/utilities/toast';
import { registerMarketplaceSale } from '@/utilities/sales';
import { parameters } from '@/constants/config';
import { NFTFactory } from '@/types/contracts';

export interface MintRequest {
  name: string;
  description: string;
  //tags: string;
  price: number;
  isFixedPrice: boolean;
  file: File;
  width: number;
  height: number;
  s3Path: string | null;
  s3PathOptimized: string | null;
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

export interface SearchableNftData {
  name: string;
  // tags: string;
  s3PathOptimized: string;
  artist: string; // username
  dId?: number; // dropId
  dName?: string; // dropName
}

const { CHAIN_ID } = parameters;

const nftsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSearchableNftData: builder.query<SearchableNftData[], void>({
      query: () => `nfts?action=GetSearchableNftData`,
    }),
    getListingNftsByArtist: builder.query<Nft_include_NftContractAndOffers[], string>({
      query: (artistAddress) => `nfts?action=GetListingNftsByArtist&address=${artistAddress}`,
      providesTags: ['Nfts'],
    }),
    getListingNftsByOwner: builder.query<CollectedListingNft[], void>({
      query: () => `nfts?action=GetListingNftsByOwner`,
      providesTags: ['Nfts'],
    }),
    mintSingleNft: builder.mutation<number, MintRequest>({
      queryFn: async (mintRequest, {}, _, fetchWithBQ) => {
        var nftId = 0;
        try {
          const endpoint = '/api/endpoints/dropUpload/';
          const artistAddress = await mintRequest.signer.getAddress();
          const nftContractAddress = await fetchOrCreateNftContract(
            artistAddress,
            mintRequest.signer,
            fetchWithBQ
          );
          const { s3Path, arweavePath, metadataPath } = await uploadToAwsAndArweave(
            mintRequest,
            endpoint
          );
          nftId = await dbInsertNft(
            mintRequest,
            artistAddress,
            s3Path,
            arweavePath,
            metadataPath,
            fetchWithBQ
          );
          console.log(`mintSingleNft() :: Minting on NFT Contract ${nftContractAddress}...`);
          const nftContract = await getNFTContract(nftContractAddress, mintRequest.signer);
          const mintTx = await nftContract.artistMint(artistAddress, metadataPath);
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
            await fetchWithBQ(`endpoints/dropUpload?action=DeleteNft&id=${nftId}`);
          }
          return { data: 0 };
        }
      },
      invalidatesTags: ['Nfts'],
    }),
    buyFromSellOffer: builder.mutation<boolean, { offer: Offer; signer: Signer }>({
      queryFn: async ({ offer, signer }, {}, _, fetchWithBQ) => {
        const marketplaceContract = await getMarketplaceContract(signer);
        const weiPrice = ethers.utils.parseEther(offer.price.toString());
        try {
          const tokenAddress = await marketplaceContract.token();
          await approveERC20Transfer(tokenAddress, marketplaceContract.address, weiPrice, signer);
        } catch (e) {
          console.error(e);
          toast.error(`Error approving transfer`);
          return { data: false };
        }
        try {
          console.log(
            `buyFromSellOffer(${offer.signer}, ${offer.nftContractAddress}, ${weiPrice}, ${offer.nftId}, ${offer.expiresAt}, ${offer.signedOffer})`
          );
          const tx = await marketplaceContract.buyFromSellOffer(
            offer.signer,
            offer.nftContractAddress,
            weiPrice,
            offer.nftId,
            offer.expiresAt,
            CHAIN_ID,
            offer.signedOffer
          );
          promiseToast(tx, `You've bought an NFT!`);
          await tx.wait(1);
          await fetchWithBQ(`nfts?action=UpdateOwner&id=${offer.id}`);
          await registerMarketplaceSale(
            offer.nftId,
            offer.price,
            await signer.getAddress(),
            tx,
            signer
          );
          return { data: true };
        } catch (e) {
          console.log(e);
          toast.error('Error buying NFT');
          return { data: false };
        }
      },
      invalidatesTags: ['Nfts'],
    }),
    sellFromBuyOffer: builder.mutation<boolean, { offer: Offer; signer: Signer }>({
      queryFn: async ({ offer, signer }, {}, _, fetchWithBQ) => {
        const marketplaceContract = await getMarketplaceContract(signer);
        const weiPrice = ethers.utils.parseEther(offer.price.toString());
        try {
          console.log(
            `sellFromBuyOffer(${offer.signer}, ${offer.nftContractAddress}, ${weiPrice}, ${offer.nftId}, ${offer.expiresAt}, ${CHAIN_ID}, ${offer.signedOffer})`
          );
          const tx = await marketplaceContract.sellFromBuyOffer(
            offer.signer,
            offer.nftContractAddress,
            weiPrice,
            offer.nftId,
            offer.expiresAt,
            CHAIN_ID,
            offer.signedOffer
          );
          promiseToast(tx, `You've sold an NFT!`);
          await tx.wait(1);
          await fetchWithBQ(`nfts?action=UpdateOwner&id=${offer.id}`);
          await registerMarketplaceSale(offer.nftId, offer.price, offer.signer, tx, signer);
          return { data: true };
        } catch (e) {
          console.log(e);
          const errMsg = extractErrorMessage(e);
          if (errMsg.includes('transfer amount exceeds balance')) {
            await fetchWithBQ(`nfts?action=InvalidateOffer&id=${offer.id}`);
          }
          toast.error(`Failure! ${errMsg}`);
          return { data: false };
        }
      },
      invalidatesTags: ['Nfts'],
    }),
    createBuyOffer: builder.mutation<null, OfferRequest>({
      queryFn: async (offer, {}, _, fetchWithBQ) => {
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
          await createSignedOffer(
            offer.nftContractAddress,
            offer.nftId,
            offer.amount,
            offer.signer,
            false,
            fetchWithBQ
          );
          toast.success(
            `Success! You've placed an offer of ${offer.amount} ASH. We'll let you know if the artist accepts it!`
          );
        } catch (e) {
          console.error(e);
          toast.error(`Error placing offer`);
        }
        return { data: null };
      },
      invalidatesTags: ['Nfts'],
    }),
    deleteBuyOffer: builder.mutation<null, number>({
      query: (offerId) => `nfts?action=DeleteOffer&id=${offerId}`,
      invalidatesTags: ['Nfts'],
    }),
  }),
});

async function uploadToAwsAndArweave(mintRequest: MintRequest, endpoint: string) {
  if (mintRequest.s3Path) {
    console.log(`uploadToAwsAndArweave() :: Media has already been uploaded to AWS S3`);
    var s3Path = mintRequest.s3Path;
  } else {
    console.log(`uploadToAwsAndArweave() :: Uploading media to AWS S3...`);
    var s3Path = await uploadFileToS3(
      endpoint,
      createBucketFolderName(),
      mintRequest.file.name,
      mintRequest.file
    );
  }
  console.log(`uploadToAwsAndArweave() :: Uploading media to Arweave...`);
  const arweavePath = await copyFromS3toArweave(endpoint, s3Path);
  console.log(`uploadToAwsAndArweave() :: Uploading metadata to Arweave...`);
  const metadataPath = await createNftMetadataOnArweave(
    endpoint,
    mintRequest.name,
    mintRequest.description,
    arweavePath,
    mintRequest.file.name.toLowerCase().endsWith('mp4')
  );
  return { s3Path, arweavePath, metadataPath };
}

async function dbInsertNft(
  mintRequest: MintRequest,
  artistAddress: string,
  s3Path: string,
  arweavePath: string,
  metadataPath: string,
  fetchWithBQ: any
) {
  console.log(`dbInsertNft() :: Creating database record...`);
  const { data } = await fetchWithBQ({
    url: `endpoints/dropUpload?action=InsertNft`,
    method: 'POST',
    body: {
      artistAddress,
      name: mintRequest.name,
      description: mintRequest.description,
      //tags: mintRequest.tags,
      price: mintRequest.price,
      width: mintRequest.width,
      height: mintRequest.height,
      s3Path,
      s3PathOptimized: mintRequest.s3PathOptimized,
      metadataPath,
      arweavePath,
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
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  const expiresAt = Math.floor(oneWeekFromNow.getTime() / 1000);
  const signerAddress = await signer.getAddress();
  const message = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'uint256', 'uint256', 'uint256', 'bool'],
    [signerAddress, nftContractAddress, weiPrice, nftId, expiresAt, CHAIN_ID, isSellOffer]
  );
  const encodedMessage = ethers.utils.keccak256(message);
  const signedOffer = await signer.signMessage(ethers.utils.arrayify(encodedMessage));
  console.log(
    `signOffer(${signerAddress}, ${nftContractAddress}, ${weiPrice}, ${nftId}, ${expiresAt}, ${CHAIN_ID}, ${isSellOffer}) :: ${signedOffer}`
  );
  return { signedOffer, expiresAt };
}

export async function fetchOrCreateNftContract(
  artistAddress: string,
  signer: Signer,
  fetchWithBQ: any
): Promise<string> {
  // check db for existing nft contract
  const { data } = await fetchWithBQ(`drops?action=GetNftContractAddress&address=${artistAddress}`);
  if (data.contractAddress) {
    console.log(
      `fetchOrCreateNftContract() :: Found existing NFT contract in database at ${data.contractAddress}`
    );
    return data.contractAddress;
  }
  // check contract factory for existing nft contract
  const nftFactoryContract = await getNftFactoryContract(signer);
  console.log(`fetchOrCreateNftContract() :: Using Factory ${nftFactoryContract.address}`);
  var artistContractAddress = await nftFactoryContract.getContractAddress(artistAddress);
  if (!artistContractAddress || artistContractAddress == ethers.constants.AddressZero) {
    console.log(`fetchOrCreateNftContract() :: Creating new NFT contract...`);
    artistContractAddress = await createNftContract(
      nftFactoryContract,
      signer,
      artistAddress,
      fetchWithBQ
    );
  }
  // update db
  await fetchWithBQ(
    `drops?action=UpdateNftContractAddress&artistAddress=${artistAddress}&contractAddress=${artistContractAddress}`
  );
  console.log(`fetchOrCreateNftContract() :: Contract deployed to ${artistContractAddress}`);
  return artistContractAddress;
}

async function createNftContract(
  factory: NFTFactory,
  signer: Signer,
  artistAddress: string,
  fetchWithBQ: any
): Promise<string> {
  var tx: ContractTransaction;
  if (artistAddress == (await signer.getAddress())) {
    tx = await factory.deployByArtist('Sage', 'SAGE');
  } else {
    tx = await factory.deployByAdmin(artistAddress, 'Sage', 'SAGE');
  }
  await tx.wait(1);
  const contractAddress = await factory.getContractAddress(artistAddress);
  if (contractAddress == ethers.constants.AddressZero) {
    throw new Error('Unable to create a new NFT contract');
  }
  console.log(`createNftContract() :: Deploying contract metadata file...`);
  const { data: response } = await fetchWithBQ({
    url: `nfts?action=DeployContractMetadata`,
    method: 'POST',
    body: { artistAddress, contractAddress },
  });
  const metadataURL = (response as any).metadataURL;
  console.log(`createNftContract() :: Setting contract metadata to ${metadataURL}`);
  const contract = await getNFTContract(contractAddress, signer);
  tx = await contract.setContractMetadata(metadataURL);
  await tx.wait();
  return contractAddress;
}

export const {
  useGetSearchableNftDataQuery,
  useGetListingNftsByArtistQuery,
  useGetListingNftsByOwnerQuery,
  useMintSingleNftMutation,
  useBuyFromSellOfferMutation,
  useSellFromBuyOfferMutation,
  useCreateBuyOfferMutation,
  useDeleteBuyOfferMutation,
} = nftsApi;
