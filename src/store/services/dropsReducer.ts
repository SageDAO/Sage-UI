import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ethers, Signer } from 'ethers';
import {
  DropFull,
  DropWithArtist,
  Drop_include_GamesAndArtist,
  Splitter_include_Entries,
} from '@/prisma/types';
import { getAuctionContract, getLotteryContract, getNFTContract } from '@/utilities/contracts';
import splitterJson from '@/constants/abis/Utils/Splitter.sol/Splitter.json';

export const dropsApi = createApi({
  reducerPath: 'dropsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  refetchOnMountOrArgChange: 60,
  tagTypes: ['PendingDrops'],
  endpoints: (builder) => ({
    getApprovedDrops: builder.query<Drop_include_GamesAndArtist[], void>({
      query: () => `drops?action=GetApprovedDrops`,
      providesTags: ['PendingDrops'],
    }),
    getDropsPendingApproval: builder.query<DropWithArtist[], void>({
      query: () => `drops?action=GetDropsPendingApproval`,
      providesTags: ['PendingDrops'],
    }),
    approveAndDeployDrop: builder.mutation<boolean, { dropId: number; signer: Signer }>({
      queryFn: async ({ dropId, signer }, {}, _, fetchWithBQ) => {
        try {
          await deployDrop(dropId, signer, fetchWithBQ);
          return { data: true };
        } catch (e) {
          console.log(e);
          return { data: false };
        }
      },
      invalidatesTags: ['PendingDrops'],
    }),
  }),
});

async function deployDrop(dropId: number, signer: Signer, fetchWithBQ: any) {
  const { data: drop } = await fetchWithBQ(`drops?action=GetFullDrop&id=${dropId}`);
  inspectDropGamesEndTimes(drop);
  await deploySplitters(drop, signer, fetchWithBQ);
  await createNftCollection(drop, signer);
  await createAuctions(drop, signer, fetchWithBQ);
  await createLotteries(drop, signer, fetchWithBQ);
  await updateDbApprovedDateAndIsLiveFlags(drop, fetchWithBQ);
}

function inspectDropGamesEndTimes(drop: DropFull) {
  const now = Math.floor(Date.now() / 1000);
  const games = new Array().concat(drop.Auctions, drop.Lotteries);
  for (var game of games) {
    if (game.endTime < now && !game.contractAddress) {
      throw new Error('One or more games have already ended; please fix dates and try again.');
    }
  }
}

async function deploySplitters(drop: DropFull, signer: Signer, fetchWithBQ: any) {
  // TODO: reuse existing splitters
  if (drop.primarySplitterId && drop.PrimarySplitter && !drop.PrimarySplitter.splitterAddress) {
    drop.PrimarySplitter.splitterAddress = await deploySplitter(drop.PrimarySplitter, signer);
    const params = `id=${drop.primarySplitterId}&address=${drop.PrimarySplitter.splitterAddress}`;
    await fetchWithBQ(`drops?action=UpdateSplitterAddress&${params}`);
  }
  if (
    drop.secondarySplitterId &&
    drop.SecondarySplitter &&
    !drop.SecondarySplitter?.splitterAddress
  ) {
    drop.SecondarySplitter.splitterAddress = await deploySplitter(drop.SecondarySplitter, signer);
    const params = `id=${drop.secondarySplitterId}&address=${drop.SecondarySplitter.splitterAddress}`;
    await fetchWithBQ(`drops?action=UpdateSplitterAddress&${params}`);
  }
}

async function deploySplitter(splitter: Splitter_include_Entries, signer: Signer): Promise<string> {
  let splitterAddress: string;
  if (splitter.SplitterEntries.length == 1) {
    console.log(`deploySplitter() :: Only one destination address found, no splitter needed.`);
    splitterAddress = splitter.SplitterEntries[0].destinationAddress;
  } else {
    console.log(`deploySplitter() :: Deploying splitter...`);
    let destinations = new Array();
    let weights = new Array();
    for (var i = 0; i < splitter.SplitterEntries.length; i++) {
      destinations.push(splitter.SplitterEntries[i].destinationAddress);
      weights.push(Math.floor(splitter.SplitterEntries[i].percent * 100)); // royalty percentage using basis points. 1% = 100
    }
    const contractFactory = new ethers.ContractFactory(
      splitterJson.abi,
      splitterJson.bytecode,
      signer
    );
    const contractInstance = await contractFactory.deploy(
      signer.getAddress(),
      destinations,
      weights
    );
    splitterAddress = contractInstance.address;
    console.log(`deploySplitter() :: Splitter deployed to ${splitterAddress}`);
  }
  return splitterAddress;
}

async function createNftCollection(drop: DropFull, signer: Signer) {
  const nftContract = await getNFTContract(signer);
  const collectionExists = await nftContract.collectionExists(drop.id);

  if (collectionExists) {
    console.log(`Collection already exists for drop ${drop.id}`);
    return;
  }

  const royaltyAddress = drop.secondarySplitterId
    ? drop.SecondarySplitter?.splitterAddress
    : drop.artistAddress;
  const primarySalesDestination = drop.primarySplitterId
    ? drop.PrimarySplitter?.splitterAddress
    : drop.artistAddress;

  // percentage in basis points (2.00% = 200)
  const royaltyPercentageBasisPoints = Math.floor(drop.royaltyPercentage * 100);
  const dropBaseUrl = `https://arweave.net/${drop.dropMetadataCid}/`;
  console.log(
    `NFTContract.createCollection(${drop.id}, ${royaltyAddress}, ${royaltyPercentageBasisPoints}, ${dropBaseUrl}, ${primarySalesDestination})`
  );
  const tx = await nftContract.createCollection(
    drop.id,
    royaltyAddress!,
    royaltyPercentageBasisPoints,
    dropBaseUrl,
    primarySalesDestination!
  );
  await tx.wait();
  console.log('Collection created');
}

async function createAuctions(drop: DropFull, signer: Signer, fetchWithBQ: any) {
  const nftContractAddress = (await getNFTContract(signer)).address;
  const auctionContract = await getAuctionContract(signer);

  for (const auction of drop.Auctions) {
    if (auction.contractAddress) {
      console.log(`Auction ${auction.id} has already been deployed to ${auction.contractAddress}`);
      continue;
    }

    const startTime = Math.floor(new Date(auction.startTime).getTime() / 1000);
    const endTime = Math.floor(new Date(auction.endTime).getTime() / 1000);
    const minimumPrice = ethers.utils.parseEther(auction.minimumPrice!);

    console.log(
      `AuctionContract.createAuction(${auction.id}, ${auction.dropId}, ${auction.nftId}, ${minimumPrice}, ${startTime}, ${endTime}, ${nftContractAddress})`
    );
    const tx = await auctionContract.createAuction(
      auction.id,
      auction.dropId,
      auction.nftId,
      minimumPrice,
      startTime,
      endTime,
      nftContractAddress
    );
    await tx.wait();

    const params = `id=${auction.id}&address=${auctionContract.address}`;
    await fetchWithBQ(`drops?action=UpdateAuctionContractAddress&${params}`);
  }
}

async function createLotteries(drop: DropFull, signer: Signer, fetchWithBQ: any) {
  const nftContractAddress = (await getNFTContract(signer)).address;
  const lotteryContract = await getLotteryContract(signer);

  for (const l of drop.Lotteries) {
    if (l.contractAddress) {
      console.log(`Lottery ${l.id} has already been deployed to ${l.contractAddress}`);
      continue;
    }

    const startTime = Math.floor(new Date(l.startTime).getTime() / 1000);
    const endTime = Math.floor(new Date(l.endTime).getTime() / 1000);
    const costPerTicketTokens = ethers.utils.parseEther(l.costPerTicketTokens.toString());
    const prizeIds = Array();
    const prizeAmounts = Array();
    for (const nft of l.Nfts) {
      if (nft.numberOfEditions > 0) {
        prizeIds.push(nft.id);
        prizeAmounts.push(nft.numberOfEditions);
      }
    }
    console.log(
      `LotteryContract.createNewLottery(${l.id}, ${l.dropId}, ${
        l.costPerTicketPoints
      }, ${costPerTicketTokens}, ${startTime}, ${endTime}, ${nftContractAddress}, ${
        l.isRefundable
      }, ${l.defaultPrizeId || 0}, ${l.maxTickets || 0}, ${l.maxTicketsPerUser || 0}, [${
        prizeIds.length
      }], [${prizeAmounts.length}])`
    );
    const tx = await lotteryContract.createLottery(
      l.id,
      l.dropId,
      l.costPerTicketPoints,
      costPerTicketTokens,
      startTime,
      endTime,
      nftContractAddress,
      l.isRefundable,
      l.defaultPrizeId || 0,
      l.maxTickets || 0,
      l.maxTicketsPerUser || 0,
      prizeIds,
      prizeAmounts
    );
    await tx.wait();

    const params = `id=${l.id}&address=${lotteryContract.address}`;
    await fetchWithBQ(`drops?action=UpdateLotteryContractAddress&${params}`);
  }
}

async function updateDbApprovedDateAndIsLiveFlags(drop: DropFull, fetchWithBQ: any): Promise<Date> {
  const { data } = await fetchWithBQ(`drops?action=UpdateApprovedDateAndIsLiveFlags&id=${drop.id}`);
  return data.approvedAt;
}

export const {
  useGetApprovedDropsQuery,
  useGetDropsPendingApprovalQuery,
  useApproveAndDeployDropMutation,
} = dropsApi;
