import { DropWithArtist, Drop_include_GamesAndArtist } from '@/prisma/types';
import { getAuctionContract, getLotteryContract, getNFTContract } from '@/utilities/contracts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ethers } from 'ethers';

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
    approveDrop: builder.mutation<Date, number>({
      queryFn: async (dropId, {}, extraOptions, fetchWithBQ) => {
        
        const { data } = await fetchWithBQ({
          url: `drops?action=ApproveDrop`,
          method: 'POST',
          body: { id: dropId },
        });
        return { data: (data as any).approvedAt as Date };
      },
      invalidatesTags: ['PendingDrops'],
    }),
  }),
});

async function deployDrop(dropId: number, fetchWithBQ: any) {
  const drop = {} as any; // fetch from db
  inspectDropEndTimes(drop);
  deploySplitters(drop);
  deployNftCollection(drop);
  deployAuctions(drop);
  deployLotteries(drop);
}

async function inspectDropEndTimes(drop: any) {
  const now = Math.floor(Date.now() / 1000);
  const games = new Array().concat(drop.auctions, drop.lotteries);
  for (var game of games) {
    if (game.endTime < now && !game.contractAddress) {
      throw new Error('One or more games have already ended; please fix before deploying drop.');
    }
  }
}

async function deploySplitters(drop: any) {
  let primarySplitterAddress = drop.PrimarySplitter?.splitterAddress;
  if (drop.primarySplitterId != null && primarySplitterAddress == null) {
    drop.PrimarySplitter.splitterAddress = await deploySplitter(drop.id, drop.primarySplitterId);
  }

  let secondarySplitterAddress = drop.SecondarySplitter?.splitterAddress;
  if (drop.secondarySplitterId != null && secondarySplitterAddress == null) {
    drop.SecondarySplitter.splitterAddress = await deploySplitter(
      drop.id,
      drop.secondarySplitterId
    );
  }
}

async function deploySplitter(dropId: number, splitterId: number) {
  // let owner = await ethers.getSigner();
  // let splitEntries = await prisma.splitEntry.findMany({
  //   where: {
  //     splitterId: splitId,
  //   },
  // });
  // if (splitEntries.length == 0) {
  //   logger.error(`No split addresses found for Drop #${dropId}`);
  //   return null;
  // }
  // let splitAddress;
  // if (splitEntries.length == 1) {
  //   logger.info(`Only one split address found for Drop #${dropId}. No splitter needed.`);
  //   splitAddress = splitEntries[0].destinationAddress;
  // } else {
  //   logger.info(`Deploying splitter for splitId #${splitId}`);
  //   let destinations = new Array();
  //   let weights = new Array();
  //   for (i = 0; i < splitEntries.length; i++) {
  //     destinations.push(splitEntries[i].destinationAddress);
  //     weights.push(parseInt(splitEntries[i].percent * 100)); // royalty percentage using basis points. 1% = 100
  //   }
  //   const Splitter = await ethers.getContractFactory('Splitter');
  //   const splitter = await Splitter.deploy(owner.address, destinations, weights);
  //   splitAddress = splitter.address;
  //   logger.info(`Splitter deployed to ${splitAddress}`);
  // }
  // await prisma.splitter.update({
  //   where: { id: splitId },
  //   data: { splitterAddress: splitAddress },
  // });
  // return splitAddress;
}

async function deployNftCollection(drop: any) {
  const nftContract = await getNFTContract(); // TODO: use SIGNER
  const collectionExists = await nftContract.collectionExists(drop.id);

  if (collectionExists) {
    console.log(`Collection already exists for drop ${drop.id}`);
    return;
  }

  const royaltyAddress = drop.secondarySplitterId
    ? drop.SecondarySplitter.splitterAddress
    : drop.artistAddress;
  const primarySalesDestination = drop.primarySplitterId
    ? drop.PrimarySplitter.splitterAddress
    : drop.artistAddress;

  // percentage in basis points (2.00% = 200)
  const royaltyPercentageBasisPoints = Math.floor(drop.royaltyPercentage * 100);
  const dropBaseUrl = `https://arweave.net/${drop.dropMetadataCid}/`;
  console.log(
    `NFTContract.createCollection(${drop.id}, ${royaltyAddress}, ${royaltyPercentageBasisPoints}, ${dropBaseUrl}, ${primarySalesDestination})`
  );
  const tx = await nftContract.createCollection(
    drop.id,
    royaltyAddress,
    royaltyPercentageBasisPoints,
    dropBaseUrl,
    primarySalesDestination
  );
  await tx.wait();
  console.log('Collection created');
}

async function deployAuctions(drop: any) {
  const nftContractAddress = (await getNFTContract()).address; // TODO: use SIGNER
  const auctionContract = await getAuctionContract(); // TODO: use SIGNER

  for (const auction of drop.auctions) {
    if (auction.contractAddress) {
      console.log(`Auction ${auction.id} has already been deployed to ${auction.contractAddress}`);
      continue;
    }

    const startTime = Math.floor(new Date(auction.startTime).getTime() / 1000);
    const endTime = Math.floor(new Date(auction.endTime).getTime() / 1000);
    const minimumPrice = ethers.utils.parseEther(auction.minimumPrice);

    console.log(
      `AuctionContract.createAuction(${auction.dropId}, ${auction.id}, ${auction.nftId}, ${minimumPrice}, ${startTime}, ${endTime}, ${nftContractAddress})`
    );
    const tx = await auctionContract.createAuction(
      auction.dropId,
      auction.id,
      auction.nftId,
      minimumPrice,
      startTime,
      endTime,
      nftContractAddress
    );
    await tx.wait();

    // await prisma.auction.update({
    //     where: {
    //         id: auction.id
    //     },
    //     data: {
    //         contractAddress: auctionAddress,
    //         isLive: true
    //     }
    // });
  }
}

async function deployLotteries(drop: any) {
  const nftContractAddress = (await getNFTContract()).address; // TODO: use SIGNER
  const lotteryContract = await getLotteryContract(); // TODO: use SIGNER

  for (const lottery of drop.lotteries) {
    if (lottery.contractAddress) {
      console.log(`Lottery ${lottery.id} has already been deployed to ${lottery.contractAddress}`);
      continue;
    }

    let startTime = Math.floor(new Date(lottery.startTime).getTime() / 1000);
    let endTime = Math.floor(new Date(lottery.endTime).getTime() / 1000);
    const costPerTicketTokens = ethers.utils.parseEther(lottery.costPerTicketTokens.toString());

    console.log(
      `LotteryContract.createNewLottery(${lottery.id}, ${lottery.dropId}, ${
        lottery.costPerTicketPoints
      }), ${costPerTicketTokens}, ${startTime}, ${endTime}, ${nftContractAddress}, ${
        lottery.isRefundable
      }, ${lottery.defaultPrizeId || 0}`
    );
    const tx = await lotteryContract.createNewLottery(
      lottery.id,
      lottery.dropId,
      lottery.costPerTicketPoints,
      costPerTicketTokens,
      startTime,
      endTime,
      nftContractAddress,
      lottery.isRefundable,
      lottery.defaultPrizeId || 0
    );
    await tx.wait();

    // TODO: refactor these two calls into the createNewLottery method
    if (lottery.maxTickets > 0) {
      console.log(`LotteryContract.setMaxTickets(${lottery.id}, ${lottery.maxTickets})`);
      await lotteryContract.setMaxTickets(lottery.id, lottery.maxTickets);
    }
    if (lottery.maxTicketsPerUser > 0) {
      console.log(`LotteryContract.setMaxTicketsPerUser(${lottery.id}, ${lottery.maxTicketsPerUser})`);
      await lotteryContract.setMaxTicketsPerUser(lottery.id, lottery.maxTicketsPerUser);
    }

    // await prisma.lottery.update({
    //     where: {
    //         id: lottery.id
    //     },
    //     data: {
    //         contractAddress: lotteryAddress,
    //         isLive: true
    //     }
    // });
    await addPrizes(lottery);
  }
}

async function addPrizes(lotteryId: number) {
  const lotteryContract = await getLotteryContract(); // TODO: use SIGNER
  const prizes = new Array<any>();
  // let prizes = await prisma.nft.findMany({
  //   where: {
  //     lotteryId: lottery.id,
  //   },
  //   orderBy: {
  //     numberOfEditions: 'asc',
  //   },
  // });
  let prizeIds = Array();
  let prizeAmounts = Array();
  for (const prize of prizes) {
    if (prize.numberOfEditions > 0) {
      prizeIds.push(prize.id);
      prizeAmounts.push(prize.numberOfEditions);
    }
  }
  if (prizeIds.length > 0) {
    console.log(`lotteryContract.addPrizes(${lotteryId}, ${prizeIds}, ${prizeAmounts})`);
    await lotteryContract.addPrizes(lotteryId, prizeIds, prizeAmounts);
  }
}

export const { useGetApprovedDropsQuery, useGetDropsPendingApprovalQuery, useApproveDropMutation } =
  dropsApi;
