import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Signer } from 'ethers';
import { getNftFactoryContract } from '@/utilities/contracts';

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
        try {
          const artistAddress = await signer.getAddress();
          const nftContractAddress = dispatch(
            nftsApi.endpoints.fetchOrCreateNftContract.initiate({ artistAddress, signer })
          );
          // TODO upload media to S3
          const s3Path = '';
          // TODO upload media to Arweave
          const ipfsPath = '';
          // TODO upload metadata to Arweave
          const metadataPath = '';
          const nftData = {
            artistAddress,
            name,
            description,
            tags,
            price,
            s3Path,
            metadataPath,
          };
          const { data } = await fetchWithBQ({
            url: `dropUploadEndpoint?action=InsertNft`,
            method: 'POST',
            body: { data: nftData },
          });
          // TODO mint NFT on blockchain
          return { data: 123 };
        } catch (e) {
          console.log(e);
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
      `_fetchOrCreateNftContract() :: Found existing NFT contract at ${data.contractAddress}`
    );
    return data.contractAddress;
  }
  console.log(
    `_fetchOrCreateNftContract() :: Creating new NFT contract for Artist ${artistAddress}`
  );

  const nftFactoryContract = await getNftFactoryContract(signer);
  var artistContractAddress = await nftFactoryContract.getContractAddress(artistAddress);
  if (
    !artistContractAddress ||
    artistContractAddress == '0x0000000000000000000000000000000000000000'
  ) {
    console.log(`_fetchOrCreateNftContract() :: Creating new NFT contract...`);
    await nftFactoryContract.createNFTContract(artistAddress, 'Sage', 'SAGE');
    artistContractAddress = await nftFactoryContract.getContractAddress(artistAddress);
  }
  await fetchWithBQ(
    `drops?action=UpdateNftContractAddress&artistAddress=${artistAddress}&contractAddress=${artistContractAddress}`
  );
  console.log(`_fetchOrCreateNftContract() :: Contract deployed to ${artistContractAddress}`);
  return artistContractAddress;
}

export const { useFetchOrCreateNftContractQuery, useMintSingleNftMutation } = nftsApi;
