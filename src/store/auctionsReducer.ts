import { GamePrize } from '@/prisma/types';
import {
  approveERC20Transfer,
  extractErrorMessage,
  getAuctionContract,
} from '@/utilities/contracts';
import { playErrorSound, playPrizeClaimedSound, playTxSuccessSound } from '@/utilities/sounds';
import { toast } from 'react-toastify';
import { Auction_include_Nft } from '@/prisma/types';
import { BigNumber, ethers, Signer, utils } from 'ethers';
import { baseApi } from './baseReducer';

export interface AuctionState {
  highestBidder: string; // wallet address
  highestBidNumber: number;
  settled: boolean;
  endTime: number; // timestamp
  nextMinBid: number;
  bidIncrementPercentage: number;
  timeExtension: number;
}

const auctionsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAuction: builder.query<Auction_include_Nft, number>({
      query: (auctionId: number) => `auctions?action=GetAuction&auctionId=${auctionId}`,
      providesTags: ['Auction'],
    }),
    getAuctionState: builder.query<AuctionState, number>({
      queryFn: async (auctionId: number, { dispatch }) => {
        console.log('getAuctionState()');
        try {
          const auctionState = await getAuctionContractState(auctionId);
          const newHighestBidEventCallback = () =>
            dispatch(auctionsApi.util.invalidateTags(['AuctionState']));
          setupBidListener(auctionId, newHighestBidEventCallback);
          return { data: auctionState };
        } catch (e) {
          return { error: { status: 400, data: {} } };
        }
      },
      providesTags: ['AuctionState'],
    }),
    getClaimedAuctionNfts: builder.query<GamePrize[], void>({
      query: () => `auctions?action=GetClaimedAuctionNfts`,
      providesTags: ['Auction'],
    }),
    getUnclaimedAuctionNfts: builder.query<GamePrize[], void>({
      query: () => `auctions?action=GetUnclaimedAuctionNfts`,
      providesTags: ['Auction'],
    }),
    placeBid: builder.mutation<null, BidArgs>({
      queryFn: async ({ auctionId, amount, signer }) => {
        console.log(`placeBid(${auctionId}, ${amount})`);
        const weiValue = ethers.utils.parseEther(amount.toString());
        try {
          const auctionContract = await getAuctionContract(signer);
          const tokenAddress = await auctionContract.erc20();
          await approveERC20Transfer(
            tokenAddress,
            auctionContract.address,
            weiValue,
            signer
          );
        } catch (e) {
          console.error(e);
          toast.error(`Error approving transfer`);
          playErrorSound();
          return { data: null };
        }
        try {
          const auctionContract = await getAuctionContract(signer);
          var tx = await auctionContract.bid(auctionId, weiValue);
          toast.promise(tx.wait(), {
            pending: 'Bid submitted to the blockchain, awaiting confirmation...',
            success: `Success! You are now the highest bidder!`,
            error: 'Failure! Unable to complete request.',
          });
          await tx.wait();
          playTxSuccessSound();
        } catch (e) {
          toast.error('Error placing bid');
          console.error(e);
        }
        return { data: null };
      },
      invalidatesTags: ['AuctionState'],
    }),
    claimAuctionNft: builder.mutation<Date, { id: number; signer: Signer }>({
      queryFn: async ({ id, signer }, {}, _extraOptions, _fetchWithBQ) => {
        console.log(`claimAuctionNft(${id})`);
        try {
          const contract = await getAuctionContract(signer);
          var tx = await contract.settleAuction(id);
          toast.promise(tx.wait(), {
            pending: 'Claim submitted to the blockchain, awaiting confirmation...',
            success: 'Success! NFT claimed and moved to your collection!',
            error: 'Failure! Unable to complete request.',
          });
          await tx.wait();
          const claimedAt = await updateDbPrizeClaimedDate(_fetchWithBQ, id);
          
          const auctionState = await contract.getAuction(id);
          await fetch(`/api/sales?action=RegisterSale`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'AUCTION',
              eventId: id,
              amountTokens: ethers.utils.formatUnits(auctionState.highestBid),
              buyer: auctionState.highestBidder,
              txHash: tx.hash,
              blockTimestamp: tx.timestamp,
            }),
          });

          playPrizeClaimedSound();
          return { data: claimedAt };
        } catch (e) {
          console.error(e);
          const errMsg = extractErrorMessage(e);
          toast.error(`Failure! ${errMsg}`);
          playErrorSound();
          return { error: { status: 500, data: null } };
        }
      },
      invalidatesTags: ['Auction', 'AuctionState'],
    }),
  }),
});

export async function getAuctionContractState(auctionId: number) {
  console.log(`getAuctionContractState(${auctionId})`);
  const auctionContract = await getAuctionContract();
  try {
    const auctionStruct = await auctionContract.getAuction(auctionId);
    const timeExtension = Number(await auctionContract.getDefaultTimeExtension());
    const endTime = auctionStruct.endTime * 1000;
    const bidIncrementPercentage = await auctionContract.getBidIncrementPercentage();
    const highestBidNumber = utils.formatUnits(auctionStruct.highestBid);
    const nextMinBid = Number(
      utils.formatUnits(
        auctionStruct.highestBid
          .mul(BigNumber.from(10000).add(bidIncrementPercentage))
          .div(BigNumber.from(10000))
      )
    );
    return {
      highestBidNumber: +highestBidNumber,
      highestBidder: auctionStruct.highestBidder,
      settled: auctionStruct.settled,
      endTime,
      nextMinBid,
      bidIncrementPercentage: +bidIncrementPercentage,
      timeExtension,
    };
  } catch (e) {
    console.log(e);
    throw new Error('Error fetching auction state');
  }
}

/*
from Auction.sol:
event BidPlaced(
        uint256 indexed auctionId,
        address indexed newBidder,
        address indexed previousBidder,
        uint256 bidAmount,
        uint256 newEndTime
    );
*/
async function setupBidListener(auctionId: number, newBidHandler: () => void) {
  console.log(`setupBidListener(${auctionId})`);
  const auctionContract = await getAuctionContract();
  if (auctionContract.listenerCount('BidPlaced') < 1) {
    auctionContract.on(
      'BidPlaced',
      (auctionId, newBidder, previousBidder, bidAmount, newEndTime) => {
        console.log(
          `Contract Event: BidPlaced(${auctionId}, ${newBidder}, ${previousBidder}, ${bidAmount}, ${newEndTime})`
        );
        toast.info(
          `Auction ${auctionId} has a new higher bidder with a bid of ${bidAmount / 10 ** 18}`
        );
        newBidHandler();
      }
    );
  }
}

export type BidArgs = { auctionId: number; amount: number; signer: Signer };

async function updateDbPrizeClaimedDate(fetchWithBQ: any, auctionId: number): Promise<Date> {
  const { data } = await fetchWithBQ({
    url: `auctions?action=UpdateNftClaimedDate&auctionId=${auctionId}`,
    method: 'POST',
  });
  return (data as any).claimedAt as Date;
}

export const {
  useGetAuctionQuery,
  useGetAuctionStateQuery,
  useClaimAuctionNftMutation,
  useGetClaimedAuctionNftsQuery,
  useGetUnclaimedAuctionNftsQuery,
  usePlaceBidMutation,
} = auctionsApi;
