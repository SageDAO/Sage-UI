import Countdown from '@/components/Countdown';
import { BaseMedia } from '@/components/Media/BaseMedia';
import PlaceBidModal, { computeAuctionStatus } from '@/components/Modals/Games/PlaceBidModal';
import useModal from '@/hooks/useModal';
import { Auction_include_Nft, User } from '@/prisma/types';
import { useGetAuctionStateQuery } from '@/store/auctionsReducer';
import { transformTitle } from '@/utilities/strings';
import React from 'react';
import TileHeader from './TileHeader';

interface Props {
  s3Path: string;
  dropName: string;
  artist: User;
  editionSize: number;
  auction: Auction_include_Nft;
}

export default function AuctionTile({ artist, dropName, s3Path, editionSize, auction }: Props) {
  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
  const { isOpen, closeModal, openModal } = useModal();

  const { isOpenForBids, isEnded, isStarted } = computeAuctionStatus(auction, auctionState!);

  if (!auctionState) return null;

  return (
    <div onClick={openModal} className='drop-page__grid-item'>
      <PlaceBidModal
        auction={auction}
        auctionState={auctionState}
        artist={artist}
        dropName={dropName}
        isOpen={isOpen}
        closeModal={closeModal}
      />
      <TileHeader editionSize={editionSize} systemType='auctions' />
      <div className='drop-page__grid-item-media-container'>
        <BaseMedia className='drop-page__grid-item-media-src' src={s3Path} />
        <div className='drop-page__grid-item-media-overlay'></div>
        <div className='drop-page__grid-item-focus'>
          {isOpenForBids ? 'place bid' : isEnded ? 'results' : 'starting soon'}
        </div>
      </div>
      <div className='drop-page__grid-item-info'>
        <div className='drop-page__grid-item-info-left'>
          <h1 className='drop-page__grid-item-info-drop-name'>
            {dropName} by {artist.username}
          </h1>
          <h1 className='drop-page__grid-item-info-game-name'>
            {transformTitle(auction.Nft.name)}
          </h1>
        </div>
        <div className='drop-page__grid-item-info-right'>
          {!isStarted && (
            <Countdown
              endTime={auction.startTime}
              className='drop-page__grid-item-info-countdown'
            ></Countdown>
          )}
          {isOpenForBids && (
            <Countdown
              endTime={auctionState?.endTime || auction.endTime}
              className='drop-page__grid-item-info-countdown'
            ></Countdown>
          )}
        </div>
      </div>
    </div>
  );
}
