import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ethers, Signer } from 'ethers';
import {
  getMarketplaceContract,
  getNFTContract,
  getNftFactoryContract,
} from '@/utilities/contracts';

export const nftsApi = createApi({
  reducerPath: 'nftsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['NftContract'],
  endpoints: (builder) => ({
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
      providesTags: ['NftContract'],
    }),
    mintSingleNft: builder.mutation<
      number,
      { name: string; description: string; tags: string; price: number; file: File; signer: Signer }
    >({
      queryFn: async (
        { name, description, tags, price, file, signer },
        { dispatch },
        _,
        fetchWithBQ
      ) => {
        var nftId = 0;
        try {
          const numberOfEditions = 1;
          const artistAddress = await signer.getAddress();
          const nftContractAddress = await _fetchOrCreateNftContract(
            artistAddress,
            signer,
            fetchWithBQ
          );
          // TODO upload media to S3
          console.log(`mintSingleNft() :: Uploading media to AWS S3...`);
          const s3Path = 'https://dev-sage.s3.us-east-2.amazonaws.com/1658180149445/nft_1.jpg';
          // TODO upload media to Arweave
          console.log(`mintSingleNft() :: Uploading media to Arweave...`);
          const ipfsPath = 'https://arweave.net/cDAQNJYsa8vNTQh0HOzpAxlTmbRQkeiD8DTNSl5OXo4';
          // TODO upload metadata to Arweave
          console.log(`mintSingleNft() :: Uploading metadata to Arweave...`);
          const metadataPath = 'https://arweave.net/nlausWAy3229BZO2MU-6_5Hk_MRBumuCW0cX601dibg';
          console.log(`mintSingleNft() :: Creating database record...`);
          const { data: dbRecord } = await fetchWithBQ({
            url: `dropUploadEndpoint?action=InsertNft`,
            method: 'POST',
            body: {
              artistAddress,
              name,
              description,
              tags,
              price,
              s3Path,
              metadataPath,
              numberOfEditions,
            },
          });
          nftId = (dbRecord as any).nftId;
          if (!nftId || nftId == 0) {
            throw new Error('Failed inserting NFT into database');
          }
          console.log(`mintSingleNft() :: Database NFT ID = ${nftId}`);
          const nftContract = await getNFTContract(nftContractAddress, signer);
          console.log(`mintSingleNft() :: Minting on NFT Contract ${nftContractAddress}...`);
          const mintTx = await nftContract.creatorMint(artistAddress, nftId, metadataPath);
          await mintTx.wait();
          const marketplaceContract = await getMarketplaceContract(signer);
          const weiPrice = ethers.utils.parseEther(price.toString());
          console.log(
            `mintSingleNft() :: Putting up for sale for ${price} (${weiPrice}) on Marketplace Contract...`
          );
          const putUpForSaleTx = await marketplaceContract.createSellOffer(
            nftContractAddress,
            nftId,
            weiPrice
          );
          await putUpForSaleTx.wait();
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
    }),
  }),
});

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
    var tx = await nftFactoryContract.createNFTContract(artistAddress, 'Sage', 'SAGE');
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

export const { useFetchOrCreateNftContractQuery, useMintSingleNftMutation } = nftsApi;
