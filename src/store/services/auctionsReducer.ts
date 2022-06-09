import { GamePrize } from '@/prisma/types';
import {
  approveERC20Transfer,
  extractErrorMessage,
  getAuctionContract,
} from '@/utilities/contracts';
import { playErrorSound, playPrizeClaimedSound, playTxSuccessSound } from '@/utilities/sounds';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { Auction_include_Nft } from '@/prisma/types';
import { ethers, Signer, BigNumber, utils } from 'ethers';

export interface AuctionState {
  highestBidder: string; // wallet address
  highestBidString: string;
  settled: boolean;
  endTime: number; // timestamp
}

export const auctionsApi = createApi({
  reducerPath: 'auctionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  refetchOnMountOrArgChange: 60,
  tagTypes: ['Auction', 'AuctionState'],
  endpoints: (builder) => ({
    getAuction: builder.query<Auction_include_Nft, number>({
      query: (auctionId: number) => `auctions?action=GetAuction&auctionId=${auctionId}`,
      providesTags: ['Auction'],
    }),
    getAuctionState: builder.query<AuctionState, number>({
      queryFn: async (auctionId: number, { dispatch }) => {
        console.log('getAuctionState()');
        const newHighestBidEventCallback = () =>
          dispatch(auctionsApi.util.invalidateTags(['AuctionState']));
        const { highestBid, highestBidder, settled, endTime } = await getAuctionContractState(
          auctionId,
          newHighestBidEventCallback
        );
        const highestBidString = utils.formatUnits(highestBid);
        const auctionState: AuctionState = {
          highestBidder,
          settled,
          endTime,
          highestBidString,
        };
        return { data: auctionState };
      },
      providesTags: ['AuctionState'],
    }),
    getUnclaimedAuctionNftsPerUser: builder.query<GamePrize[], void>({
      query: () => `auctions?action=GetUnclaimedAuctionNftsPerUser`,
      providesTags: ['Auction'],
    }),
    claimAuctionNft: builder.mutation<Date, number>({
      queryFn: async (auctionId, {}, _extraOptions, _fetchWithBQ) => {
        try {
          const contract = await getAuctionContract();
          var tx = await contract.settleAuction(auctionId);
          toast.promise(tx.wait(), {
            pending: 'Request submitted to the blockchain, awaiting confirmation...',
            success: 'Success! NFT claimed!',
            error: 'Failure! Unable to complete request.',
          });
          await tx.wait();
          var claimedAt = await updateDbPrizeClaimedDate(_fetchWithBQ, auctionId);
        } catch (e) {
          console.error(e);
          const errMsg = extractErrorMessage(e);
          toast.error(`Failure! ${errMsg}`);
          playErrorSound();
          return { error: { status: 500, data: null } };
        }
        playPrizeClaimedSound();
        return { data: claimedAt };
      },
      invalidatesTags: ['Auction', 'AuctionState'],
    }),
  }),
});

export async function getAuctionContractState(auctionId: number, stateUpdateCallback?: () => void) {
  console.log(`getAuctionContractState(${auctionId})`);
  const auctionContract = await getAuctionContract();
  const auctionStruct = await auctionContract.getAuction(auctionId);
  if (stateUpdateCallback) {
    setupBidListener(auctionId, stateUpdateCallback);
  }

  const auctionState = {
    highestBid: auctionStruct.highestBid,
    highestBidder: auctionStruct.highestBidder,
    settled: auctionStruct.settled,
    endTime: auctionStruct.endTime,
  };

  return auctionState;
}

/*
from MemeXAuction.sol:
event BidPlaced(
  uint256 indexed auctionId,
  address indexed bidder,
  uint256 bidAmount,
  uint256 newEndTime
);
*/
async function setupBidListener(auctionId: number, stateUpdateCallback: () => void) {
  console.log(`setupBidListener(${auctionId})`);
  const contract = await getAuctionContract();
  if (!contract.listenerCount()) {
    contract.on('BidPlaced', (auctionId, bidder, bidAmount, newEndTime) => {
      console.log(
        `Contract Event: BidPlaced(${auctionId}, ${bidder}, ${bidAmount}, ${newEndTime})`
      );
      toast.info(
        `Auction ${auctionId} has a new higher bidder with a bid of ${bidAmount / 10 ** 18}`
      );
      stateUpdateCallback();
    });
  }
}

export type BidArgs = { auctionId: number; amount: number; signer: Signer };

export async function bid({ auctionId, amount, signer }: BidArgs) {
  console.log(`bid(${auctionId}, ${amount})`);
  const weiValue = ethers.utils.parseEther(amount.toString());
  try {
    // const erc20AddressASH = '0x64d91f12ece7362f91a6f8e7940cd55f05060b92';
    const auctionContract = await getAuctionContract(signer);
    const tokenAddress = await auctionContract.token();
    await approveERC20Transfer(tokenAddress, signer, amount);
  } catch (e) {
    console.error(e);
    toast.error(`error approving transfer`);
    playErrorSound();
    return;
  }

  try {
    const auctionContract = await getAuctionContract(signer);
    var tx = await auctionContract.bid(auctionId, weiValue, { gasLimit: 1000000 });
    toast.promise(tx.wait(), {
      pending: 'Request submitted to the blockchain, awaiting confirmation...',
      success: `Success! You are now the highest bidder!`,
      error: 'Failure! Unable to complete request.',
    });
    await tx.wait();
    playTxSuccessSound();
  } catch (e) {
    toast.error('error placing bid');
    console.error(e);
    return;
  }
}

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
  useGetUnclaimedAuctionNftsPerUserQuery,
} = auctionsApi;
