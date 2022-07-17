import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ethers, Signer } from 'ethers';
import nftContractJson from '@/constants/abis/NFT/SageNFT.sol/SageNFT.json';

export const nftsApi = createApi({
  reducerPath: 'nftsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['NftContract'],
  endpoints: (builder) => ({
    fetchOrDeployNftContract: builder.query<string, { artistAddress: string; signer: Signer }>({
      queryFn: async ({ artistAddress, signer }, { dispatch }, _, fetchWithBQ) => {
        try {
          const contractAddress = await _fetchOrDeployNftContract(
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
            nftsApi.endpoints.fetchOrDeployNftContract.initiate({ artistAddress, signer })
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
            metadataPath
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

async function _fetchOrDeployNftContract(
  artistAddress: string,
  signer: Signer,
  fetchWithBQ: any
): Promise<string> {
  const { data } = await fetchWithBQ(`drops?action=GetNftContractAddress&address=${artistAddress}`);
  if (data.contractAddress) {
    console.log(
      `_fetchOrDeployNftContract() :: Found existing NFT contract at ${data.contractAddress}`
    );
    return data.contractAddress;
  }
  console.log(
    `_fetchOrDeployNftContract() :: Deploying new NFT contract for Artist ${artistAddress}`
  );
  const keccak256 = require('keccak256');
  const MINTER_ROLE = keccak256('MINTER_ROLE');
  const BURNER_ROLE = keccak256('BURNER_ROLE');
  const royalties = Math.floor(parseFloat(data.royaltyPercentage) * 100);
  const deployerAddress = await signer.getAddress();
  const contractFactory = new ethers.ContractFactory(
    nftContractJson.abi,
    nftContractJson.bytecode,
    signer
  );
  console.log('3');
  const contractInstance = await contractFactory.deploy();
  console.log('4');
  contractInstance.initialize(
    'Sage',
    'SAGE',
    artistAddress, // sales destination
    royalties,
    artistAddress // royalties destination
  );
  console.log('5');
  await contractInstance.grantRole(MINTER_ROLE, artistAddress);
  console.log('6');
  await contractInstance.grantRole(BURNER_ROLE, deployerAddress);
  console.log('7');
  await fetchWithBQ(
    `drops?action=UpdateNftContractAddress&artistAddress=${artistAddress}&contractAddress=${contractInstance.address}`
  );
  console.log('8');
  console.log(`_fetchOrDeployNftContract() :: Contract deployed to ${contractInstance.address}`);
  return contractInstance.address;
}

export const { useFetchOrDeployNftContractQuery, useMintSingleNftMutation } = nftsApi;
