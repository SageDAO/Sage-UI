import { Auction_include_Nft, User } from '@/prisma/types';
import {
  AuctionState,
  useGetAuctionStateQuery,
  useGetNftByAuctionAndWinnerQuery,
} from '@/store/auctionsReducer';
import { transformTitle } from '@/utilities/strings';
import { useEffect } from 'react';

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
  const buttonText = 'place bid';
  const description = auction.Nft.description || 'This artwork has no description provided.';

  useEffect(() => {
    if (walletAddress && auctionState && walletAddress == auctionState.highestBidder) {
      refetchPrize();
    }
  }, [auctionState]);

  return {
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
    bidLabel,
    highestBid,
    highestBidder,
    nextMinBid,
    buttonText,
    description,
    prize,
  };
}

function getIsOpenForBids(auctionState: AuctionState, startTime: Date): boolean {
  if (!auctionState) {
    return false;
  }
  const now = new Date().getTime();
  if (startTime.getTime() > now) {
    return false;
  }
  if (auctionState.endTime == 0) {
    const endTime = startTime.getTime() + auctionState.duration * 1000;
    return endTime > now;
  }
  return auctionState.endTime > now;
}

function getIsEnded(auctionState: AuctionState, startTime: Date): boolean {
  if (!auctionState) {
    return false;
  }
  const now = new Date().getTime();
  if (auctionState.endTime == 0) {
    const endTime = startTime.getTime() + auctionState.duration * 1000;
    return endTime < now;
  }
  return auctionState.endTime < now;
}
