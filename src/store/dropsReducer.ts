import { ethers, Signer } from 'ethers';
import { DropFull, Drop_include_GamesAndArtist, Splitter_include_Entries } from '@/prisma/types';
import { toast } from 'react-toastify';
import { getAuctionContract, getLotteryContract } from '@/utilities/contracts';
import splitterContractJson from '@/constants/abis/Utils/Splitter.sol/Splitter.json';
import { _fetchOrCreateNftContract } from './nftsReducer';
import { baseApi } from './baseReducer';

export interface PresetDrop {
  artistAddress: string;
  dropName: string;
  bannerS3Path: string;
  nfts: string[]; // s3 paths
}

const dropsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createPresetDrops: builder.mutation<
      boolean,
      { presetDrops: PresetDrop[]; durationHours: number }
    >({
      queryFn: async ({ presetDrops, durationHours }, {}, _, fetchWithBQ) => {
        await createPresetDrops(presetDrops, durationHours, fetchWithBQ);
        return { data: true };
      },
    }),
    getApprovedDrops: builder.query<Drop_include_GamesAndArtist[], void>({
      query: () => `drops?action=GetApprovedDrops`,
      providesTags: ['PendingDrops'],
    }),
    getDropsPendingApproval: builder.query<Drop_include_GamesAndArtist[], void>({
      query: () => `drops?action=GetDropsPendingApproval`,
      providesTags: ['PendingDrops'],
    }),
    getPresetDrops: builder.query<[], void>({
      query: () => `drops?action=GetPresetDrops`,
    }),
    approveAndDeployDrop: builder.mutation<boolean, { dropId: number; signer: Signer }>({
      queryFn: async ({ dropId, signer }, { dispatch }, _, fetchWithBQ) => {
        try {
          await deployDrop(dropId, signer, fetchWithBQ);
          dispatch(dropsApi.util.invalidateTags(['PendingDrops'])); // refetch pending drops
          return { data: true };
        } catch (e) {
          console.log(e);
          return { data: false };
        }
      },
    }),
    deleteDrop: builder.mutation<null, number>({
      queryFn: async (dropId, {}, _, fetchWithBQ) => {
        await fetchWithBQ(`drops?action=DeleteDrop&id=${dropId}`);
        return { data: null };
      },
      invalidatesTags: ['PendingDrops'],
    }),
  }),
});

function addHours(numOfHours: number, date = new Date()) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
}

async function createPresetDrops(
  presetDrops: PresetDrop[],
  durationHours: number,
  fetchWithBQ: any
) {
  const startDate = addHours(0.5);
  const endDate = addHours(durationHours);
  for (const drop of presetDrops) {
    // TODO check if address belongs to 'ARTIST' role
    const { data } = await fetchWithBQ({
      url: `drops?action=InsertDrop`,
      method: 'POST',
      body: {
        artistWallet: drop.artistAddress,
        name: drop.dropName,
        bannerImageS3Path: drop.bannerS3Path,
      },
    });
    const dropId = (data as any).dropId as number;
    for (const nft of drop.nfts) {
      if (Math.random() > 0.5) {
        // Auction
        // const { data } = await fetchWithBQ({
        //   url: `drops?action=InsertAuction`,
        //   method: 'POST',
        //   body: {
        //     dropId,
        //     minimumPrice: Math.floor(Math.random() * 101)
        //     bannerImageS3Path: drop.bannerS3Path,
        //   },
        // });

        // data: {
        //   Drop: { connect: { id: Number(data.dropId) } },
        //   minimumPrice: data.minPrice,
        //   startTime: new Date(Number(data.startDate) * 1000),
        //   endTime: new Date(Number(data.endDate) * 1000),
        //   Nft: {
        //     create: {
        //       name: data.name,
        //       description: data.description || '',
        //       // tags: data.tags || '',
        //       numberOfEditions: 1,
        //       metadataPath: data.metadataPath,
        //       s3Path: data.s3Path,
        //       s3PathOptimized: data.s3PathOptimized || data.s3Path,
        //     },
        //   },
        // },

      } else {
        // Drawing
      }
    }
  }
}

async function deployDrop(dropId: number, signer: Signer, fetchWithBQ: any) {
  const { data: drop } = await fetchWithBQ(`drops?action=GetFullDrop&id=${dropId}`);
  inspectDropGamesEndTimes(drop);
  //await processSplitter(drop.PrimarySplitter, signer, fetchWithBQ);
  //await processSplitter(drop.SecondarySplitter, signer, fetchWithBQ);
  //await createNftCollection(drop, signer);
  const artistNftContractAddress = await _fetchOrCreateNftContract(
    drop.artistAddress,
    signer,
    fetchWithBQ
  );
  if (artistNftContractAddress == ethers.constants.AddressZero) {
    throw new Error('Unable to deploy a new artist NFT contract');
  }
  await deployAuctions(drop, artistNftContractAddress, signer, fetchWithBQ);
  await deployLotteries(drop, artistNftContractAddress, signer, fetchWithBQ);
  await updateDbApprovedDateAndIsLiveFlags(drop, fetchWithBQ);
}

function inspectDropGamesEndTimes(drop: DropFull) {
  const now = Math.floor(Date.now() / 1000);
  const games = new Array().concat(drop.Auctions, drop.Lotteries);
  for (var game of games) {
    const endTime = Math.floor(new Date(game.endTime).getTime() / 1000);
    if (endTime < now && !game.contractAddress) {
      const errMsg = 'One or more games have already ended; please fix dates and try again.';
      toast.warn(errMsg);
      throw new Error(errMsg);
    }
  }
}

async function processSplitter(
  splitter: Splitter_include_Entries,
  signer: Signer,
  fetchWithBQ: any
) {
  if (!splitter) {
    return;
  }
  if (!splitter.splitterAddress) {
    // reuse existing deployed splitters with matching entries (percents & destinations)
    const queryUrl = `drops?action=FindSplitterAddress&id=${splitter.id}`;
    const { data: matchingSplitters } = await fetchWithBQ(queryUrl);
    if (matchingSplitters.length > 0) {
      console.log(`processSplitter() :: Found existing matching splitter!`);
      splitter.splitterAddress = matchingSplitters[0].splitterAddress;
    } else {
      console.log(`processSplitter() :: Deploying new splitter contract...`);
      splitter.splitterAddress = await deploySplitter(splitter, signer);
    }
    if (splitter.splitterAddress) {
      const params = `id=${splitter.id}&address=${splitter.splitterAddress}`;
      await fetchWithBQ(`drops?action=UpdateSplitterAddress&${params}`);
    }
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
      splitterContractJson.abi,
      splitterContractJson.bytecode,
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
  // const nftContract = await getNFTContract(signer);
  // const collectionExists = await nftContract.collectionExists(drop.id);
  // if (collectionExists) {
  //   console.log(`createNftCollection() :: Collection already exists for drop ${drop.id}`);
  //   return;
  // }
  // const royaltyAddress = drop.secondarySplitterId
  //   ? drop.SecondarySplitter?.splitterAddress
  //   : drop.artistAddress;
  // const primarySalesDestination = drop.primarySplitterId
  //   ? drop.PrimarySplitter?.splitterAddress
  //   : drop.artistAddress;
  // // percentage in basis points (2.00% = 200)
  // const royaltyPercentageBasisPoints = Math.floor(drop.royaltyPercentage * 100);
  // const dropBaseUrl = `https://arweave.net/${drop.dropMetadataCid}/`;
  // console.log(
  //   `NFTContract.createCollection(${drop.id}, ${royaltyAddress}, ${royaltyPercentageBasisPoints}, ${dropBaseUrl}, ${primarySalesDestination})`
  // );
  // const tx = await nftContract.createCollection(
  //   drop.id,
  //   royaltyAddress!,
  //   royaltyPercentageBasisPoints,
  //   dropBaseUrl,
  //   primarySalesDestination!
  // );
  // await tx.wait();
  // console.log('createNftCollection() :: Collection created');
}

async function deployAuctions(
  drop: DropFull,
  artistNftContractAddress: string,
  signer: Signer,
  fetchWithBQ: any
) {
  const auctionContract = await getAuctionContract(signer);

  for (const auction of drop.Auctions) {
    if (auction.contractAddress) {
      console.log(
        `deployAuctions() :: Auction ${auction.id} has already been deployed to ${auction.contractAddress}`
      );
      continue;
    }

    const startTime = Math.floor(new Date(auction.startTime).getTime() / 1000);
    const endTime = Math.floor(new Date(auction.endTime).getTime() / 1000);
    const minimumPrice = ethers.utils.parseEther(auction.minimumPrice!);

    console.log(
      `deployAuctions() :: AuctionContract.createAuction(${auction.id}, ${auction.nftId}, ${minimumPrice}, ${startTime}, ${endTime}, ${artistNftContractAddress}), ${auction.Nft.metadataPath}`
    );
    const tx = await auctionContract.createAuction(
      auction.id,
      auction.nftId,
      minimumPrice,
      startTime,
      endTime,
      artistNftContractAddress,
      auction.Nft.metadataPath
    );
    await tx.wait();

    const params = `id=${auction.id}&address=${auctionContract.address}`;
    await fetchWithBQ(`drops?action=UpdateAuctionContractAddress&${params}`);
  }
}

async function deployLotteries(
  drop: DropFull,
  artistNftContractAddress: string,
  signer: Signer,
  fetchWithBQ: any
) {
  const lotteryContract = await getLotteryContract(signer);

  for (const l of drop.Lotteries) {
    if (l.contractAddress) {
      console.log(
        `deployLotteries() :: Lottery ${l.id} has already been deployed to ${l.contractAddress}`
      );
      continue;
    }

    const startTime = Math.floor(new Date(l.startTime).getTime() / 1000);
    const endTime = Math.floor(new Date(l.endTime).getTime() / 1000);
    const costPerTicketTokens = ethers.utils.parseEther(l.costPerTicketTokens.toString());
    const nftsSortedById = l.Nfts.sort((a, b) => a.id - b.id);
    const lowestId = nftsSortedById[0].id;
    const highestId = nftsSortedById[nftsSortedById.length - 1].id;

    console.log(
      `LotteryContract.createLottery(${l.id}, ${
        l.costPerTicketPoints
      }, ${costPerTicketTokens}, ${startTime}, ${endTime}, ${artistNftContractAddress}, ${
        l.maxTickets || 0
      }, ${l.maxTicketsPerUser || 0}, ${lowestId}, ${highestId})`
    );
    const tx = await lotteryContract.createLottery(
      l.id,
      l.costPerTicketPoints,
      costPerTicketTokens,
      startTime,
      endTime,
      artistNftContractAddress,
      l.maxTickets || 0,
      l.maxTicketsPerUser || 0,
      lowestId,
      highestId
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
  useGetPresetDropsQuery,
  useApproveAndDeployDropMutation,
  useCreatePresetDropsMutation,
  useDeleteDropMutation,
} = dropsApi;
