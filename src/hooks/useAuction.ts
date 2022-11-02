import { Auction_include_Nft, User } from '@/prisma/types';
import {
  AuctionState,
  useGetAuctionStateQuery,
  useGetNftByAuctionAndWinnerQuery,
} from '@/store/auctionsReducer';
import { transformTitle } from '@/utilities/strings';
import { useEffect, useMemo } from 'react';

interface Args {
  auction: Auction_include_Nft;
  artist: User;
  walletAddress?: string;
}

export default function useAuction({ auction, artist, walletAddress }: Args) {
  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
  const { data: prize, refetch: refetchPrize } = useGetNftByAuctionAndWinnerQuery(
    {
      auctionId: auction.id,
      walletAddress: walletAddress,
    },
    { skip: !walletAddress }
  );
  const now = new Date().getTime();
  const isOpenForBids = getIsOpenForBids(auctionState, auction.startTime);
  const isStarted = auction.startTime.getTime() < now;
  const isRunning = !!auctionState?.endTime;
  const isEnded = getIsEnded(auctionState, auction.startTime);
  const auctionFocusText = isOpenForBids ? 'place bid' : isEnded ? 'results' : 'starting soon';
  const startTime = auction.startTime;
  const endTime = auctionState?.endTime || auction.endTime;
  const nftName = transformTitle(auction.Nft.name);
  const artistName = transformTitle(artist.username);
  const editionSize = auction.Nft.numberOfEditions;
  const nftPath = auction.Nft.s3PathOptimized;
  const bidLabel = auction.winnerAddress
    ? 'winning bid'
    : !isEnded
    ? 'current highest bid'
    : 'highest bid';
  const highestBid = auctionState?.highestBidNumber;
  const highestBidder = auctionState?.highestBidder;
  const nextMinBid = auctionState?.nextMinBid;
  const description = auction.Nft.description || 'This artwork has no description provided.';
  const duration = auctionState?.duration / 60 / 60;
  const durationDisplay = `${duration.toFixed(2)} hours`;

  const gameInfo = useMemo(() => {
    const reservedAuctionInfo = `Reserve Auctions have a minimum bid price. Once the minimum bid price is met, the auction will last for ${durationDisplay}. Bidders may extend the auction by 10 minutes when entering a bidding war at the end of the auction. When the clock stops, the highest bidder wins the auction.`;
    const auctionInfo = `Auctions will last for ${durationDisplay}. Bidders may extend the auction by 10 minutes when entering a bidding war at the end of the auction. When the clock stops, the highest bidder wins the auction.`;

    return auction.minimumPrice ? reservedAuctionInfo : auctionInfo;
  }, [durationDisplay]);

  useEffect(() => {
    if (walletAddress && auctionState && walletAddress == auctionState.highestBidder) {
      refetchPrize();
    }
  }, [auctionState]);

  return {
    gameInfo,
    isStarted,
    isRunning,
    isOpenForBids,
    isEnded,
    auctionState,
    auctionFocusText,
    endTime,
    startTime,
    nftName,
    artistName,
    editionSize,
    nftPath,
    duration,
    bidLabel,
    highestBid,
    highestBidder,
    nextMinBid,
    description,
    prize,
  };
}

function getIsOpenForBids(auctionState: AuctionState, startTime: Date): boolean {
  //auction state not available
  if (!auctionState) {
    return false;
  }
  const now = new Date().getTime();

  //designated start time has passed
  //waiting for minimum bid
  if (startTime.getTime() < now) {
    //minimum bid in place
    if (auctionState.endTime !== 0) {
      return auctionState.endTime > now;
    }

    return true;
  }

  return false;
}

function getIsEnded(auctionState: AuctionState, startTime: Date): boolean {
  //auctionState not available
  if (!auctionState) {
    return false;
  }
  const now = new Date().getTime();
  //minimum bid not met
  if (auctionState.endTime == 0 && !auctionState.settled) {
    return false;
  }
  //check if endtime has passed
  return auctionState.endTime < now;
}
