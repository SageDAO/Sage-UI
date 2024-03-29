import { ethers, Signer } from 'ethers';
import { DropFull, Drop_include_GamesAndArtist, Splitter_include_Entries } from '@/prisma/types';
import { toast } from 'react-toastify';
import { getAuctionContract, getLotteryContract } from '@/utilities/contracts';
import splitterContractJson from '@/constants/abis/Utils/Splitter.sol/Splitter.json';
import { fetchOrCreateNftContract } from './nftsReducer';
import { baseApi } from './baseReducer';
import { Role } from '@prisma/client';

export interface PresetDropArtist {
  walletAddress: string;
  username: string | null;
  role: Role | null;
}

export interface PresetDrop {
  artist: PresetDropArtist;
  dropName: string;
  bannerS3Path: string;
  nfts: string[]; // s3 paths
}

const dropsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createPresetDrops: builder.mutation<boolean, { presetDrops: PresetDrop[]; durationHours: number }>(
      {
        queryFn: async ({ presetDrops, durationHours }, {}, _, fetchWithBQ) => {
          try {
            await createPresetDrops(presetDrops, durationHours, fetchWithBQ);
            return { data: true };
          } catch (e) {
            console.log(e);
          }
          return { data: false };
        },
        invalidatesTags: ['PendingDrops'],
      }
    ),
    getApprovedDrops: builder.query<Drop_include_GamesAndArtist[], void>({
      query: () => `drops?action=GetApprovedDrops`,
      providesTags: ['PendingDrops'],
    }),
    getDropsPendingApproval: builder.query<Drop_include_GamesAndArtist[], void>({
      query: () => `drops?action=GetDropsPendingApproval`,
      providesTags: ['PendingDrops'],
    }),
    getPresetDrops: builder.query<PresetDrop[], void>({
      queryFn: async (undefined, {}, _, fetchWithBQ) => {
        // retry this operation because aws-sdk fails server-side randomly
        return { data: await fetchWithRetries(`drops?action=GetPresetDrops`, 5, fetchWithBQ) };
      },
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
      query: (dropId) => `drops?action=DeleteDrop&id=${dropId}`,
      invalidatesTags: ['PendingDrops'],
    }),
    deleteDrops: builder.mutation<null, void>({
      query: () => `drops?action=DeleteDrops`,
      invalidatesTags: ['PendingDrops'],
    }),
  }),
});

function addHours(numOfHours: number, date = new Date()) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
}

async function fetchWithRetries(url: string, retriesLeft: number, fetchWithBQ: any): Promise<any> {
  try {
    console.log(`fetchWithRetries('${url}') :: ${retriesLeft} retries left`);
    const result = await fetchWithBQ(url);
    if (result.error) {
      throw new Error();
    }
    return result.data;
  } catch (e) {
    if (retriesLeft > 1) {
      return await fetchWithRetries(url, --retriesLeft, fetchWithBQ);
    }
    throw e;
  }
}

async function createPresetDrops(
  presetDrops: PresetDrop[],
  durationHours: number,
  fetchWithBQ: any
) {
  // TODO fix test paths below
  const metadataPath = 'https://arweave.net/2capUuzTo1t4SPe3VGEwBmkrgFMPgFMgdQdKo3Msqgo';
  const arweavePath = 'https://arweave.net/2capUuzTo1t4SPe3VGEwBmkrgFMPgFMgdQdKo3Msqgo';
  const startDate = Math.floor(addHours(0.0833).getTime() / 1000); // starts in 5 minutes
  const endDate = Math.floor(addHours(durationHours + 0.0833).getTime() / 1000);
  await checkUsersExistAndAreArtists(presetDrops, fetchWithBQ);
  for (const presetDrop of presetDrops) {
    const { data: dropResult } = await fetchWithBQ({
      url: `endpoints/dropUpload?action=InsertDrop`,
      method: 'POST',
      body: {
        artistWallet: presetDrop.artist.walletAddress,
        name: presetDrop.dropName,
        bannerImageS3Path: presetDrop.bannerS3Path,
      },
    });
    const dropId = (dropResult as any).dropId as number;
    console.log(`createPresetDrops() :: Added drop ${dropId}`);
    for (const nftS3Path of presetDrop.nfts) {
      if (Math.random() > 0.6) {
        // Auction
        const { data: auctionResult } = await fetchWithBQ({
          url: `endpoints/dropUpload?action=InsertAuction`,
          method: 'POST',
          body: {
            dropId,
            minPrice: '1',
            bannerImageS3Path: presetDrop.bannerS3Path,
            width: 1024,
            height: 1024,
            startDate,
            endDate,
            name: nftS3Path.split('/').pop().split('.')[0].replace('%20', ' '),
            metadataPath,
            arweavePath,
            s3Path: nftS3Path,
            s3PathOptimized: nftS3Path,
          },
        });
        const auctionId = (auctionResult as any).auctionId as number;
        console.log(`createPresetDrops() :: Added auction ${auctionId} to drop ${dropId}`);
      } else {
        // Drawing
        const { data: drawingResult } = await fetchWithBQ({
          url: `endpoints/dropUpload?action=InsertDrawing`,
          method: 'POST',
          body: {
            dropId,
            ticketCostTokens: Math.random() > 0.5 ? 1 : 2,
            ticketCostPoints: Math.random() > 0.5 ? 0 : 1,
            maxTickets: 0,
            maxTicketsPerUser: 0,
            startDate,
            endDate,
          },
        });
        const drawingId = (drawingResult as any).drawingId as number;
        console.log(`createPresetDrops() :: Added drawing ${drawingId} to drop ${dropId}`);
        const { data: nftResult } = await fetchWithBQ({
          url: `endpoints/dropUpload?action=InsertNft`,
          method: 'POST',
          body: {
            dropId,
            drawingId,
            name: nftS3Path.split('/').pop().split('.')[0].replace('%20', ' '),
            numberOfEditions: 1,
            width: 1024,
            height: 1024,
            metadataPath,
            arweavePath,
            s3Path: nftS3Path,
            s3PathOptimized: nftS3Path,
          },
        });
        const nftId = (nftResult as any).nftId as number;
        console.log(`createPresetDrops() :: Added nft ${nftId} to drawing ${drawingId}`);
      }
    }
  }
}

async function checkUsersExistAndAreArtists(presetDrops: PresetDrop[], fetchWithBQ: any) {
  var uniqueArtists = [];
  presetDrops.filter(function (drop) {
    var i = uniqueArtists.findIndex((x) => x.walletAddress == drop.artist.walletAddress);
    if (i <= -1) {
      uniqueArtists.push(drop.artist);
    }
    return null;
  });
  var ok = true;
  for (const artist of uniqueArtists) {
    if (artist.role != Role.ARTIST) {
      toast.error(`Failure: promote ${artist.username} to ARTIST before creating the drop.`)
      ok = false;
    }
  }
  if (!ok) throw new Error();
}

async function deployDrop(dropId: number, signer: Signer, fetchWithBQ: any) {
  const { data: drop } = await fetchWithBQ(`drops?action=GetFullDrop&id=${dropId}`);
  inspectDropGamesEndTimes(drop);
  //await processSplitter(drop.PrimarySplitter, signer, fetchWithBQ);
  //await processSplitter(drop.SecondarySplitter, signer, fetchWithBQ);
  //await createNftCollection(drop, signer);
  const artistNftContractAddress = await fetchOrCreateNftContract(
    drop.artistAddress,
    signer,
    fetchWithBQ
  );
  if (artistNftContractAddress == ethers.constants.AddressZero) {
    throw new Error('Unable to deploy a new artist NFT contract');
  }
  // trigger server-side task that optimizes NFT images
  await fetchWithBQ(`drops?action=OptimizeDropImages&id=${dropId}`);
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
  const createParams = [];
  for (const auction of drop.Auctions) {
    if (auction.contractAddress) {
      console.log(
        `deployAuctions() :: ${auction.id} has already been deployed to ${auction.contractAddress}`
      );
      continue;
    }
    const startTime = Math.floor(new Date(auction.startTime).getTime() / 1000);
    const endTime = Math.floor(new Date(auction.endTime).getTime() / 1000);
    const minimumPrice = ethers.utils.parseEther(auction.minimumPrice!);
    createParams.push({
      auctionId: auction.id,
      nftId: auction.nftId,
      minimumPrice,
      startTime,
      endTime: 0,
      duration: 24*60*60,
      nftContract: artistNftContractAddress,
      nftUri: auction.Nft.metadataPath,
      settled: false,
      highestBid: 0,
      highestBidder: ethers.constants.AddressZero,
    });
  }
  if (createParams.length > 0) {
    console.log(`deployAuctions() :: Deploying batch of ${createParams.length}...`);
    const tx = await auctionContract.createAuctionBatch(createParams);
    await tx.wait();
    for (const { auctionId } of createParams) {
      const params = `id=${auctionId}&address=${auctionContract.address}`;
      await fetchWithBQ(`drops?action=UpdateAuctionContractAddress&${params}`);
    }
  }
}

async function deployLotteries(
  drop: DropFull,
  artistNftContractAddress: string,
  signer: Signer,
  fetchWithBQ: any
) {
  const createParams = [];
  for (const l of drop.Lotteries) {
    if (l.contractAddress) {
      console.log(`deployLotteries() :: ${l.id} has already been deployed to ${l.contractAddress}`);
      continue;
    }
    const startTime = Math.floor(new Date(l.startTime).getTime() / 1000);
    const endTime = Math.floor(new Date(l.endTime).getTime() / 1000);
    const costPerTicketTokens = ethers.utils.parseEther(l.costPerTicketTokens.toString());
    createParams.push({
      lotteryID: l.id,
      ticketCostPoints: l.costPerTicketPoints,
      ticketCostTokens: costPerTicketTokens,
      startTime,
      closeTime: endTime,
      nftContract: artistNftContractAddress,
      maxTickets: l.maxTickets || 0,
      maxTicketsPerUser: l.maxTicketsPerUser || 0,
      numberOfEditions: l.Nfts[0].numberOfEditions,
      participantsCount: 0,
      numberOfTicketsSold: 0,
      status: 0, // Status.Created
    });
  }
  if (createParams.length > 0) {
    console.log(`deployLotteries() :: Deploying batch of ${createParams.length}...`);
    const lotteryContract = await getLotteryContract(signer);
    const tx = await lotteryContract.createLotteryBatch(createParams);
    await tx.wait();
    for (const { lotteryID } of createParams) {
      const params = `id=${lotteryID}&address=${lotteryContract.address}`;
      await fetchWithBQ(`drops?action=UpdateLotteryContractAddress&${params}`);
    }
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
  useDeleteDropsMutation,
} = dropsApi;
