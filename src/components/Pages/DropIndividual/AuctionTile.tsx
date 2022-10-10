import Countdown from '@/components/Countdown';
import PlaceBidModal from '@/components/Modals/Games/PlaceBidModal';
import useAuction from '@/hooks/useAuction';
import useModal from '@/hooks/useModal';
import { Auction_include_Nft, User } from '@/prisma/types';
import React from 'react';
import Media from './Media';
import TileHeader from './TileHeader';

interface Props {
  dropName: string;
  artist: User;
  auction: Auction_include_Nft;
}

export default function AuctionTile({ artist, dropName, auction }: Props) {
  const { isOpen, closeModal, openModal } = useModal();

  const {
    nftPath,
    auctionFocusText,
    editionSize,
    isStarted,
    isOpenForBids,
    endTime,
    startTime,
    artistName,
    auctionState,
    nftName,
  } = useAuction({
    auction,
    artist,
  });

  if (!auctionState) return null;

  return (
    <div onClick={openModal} className='drop-page__grid-item'>
      <PlaceBidModal
        auction={auction}
        artist={artist}
        dropName={dropName}
        isOpen={isOpen}
        closeModal={closeModal}
      />
      <TileHeader editionSize={editionSize} systemType='auction' />
      <Media src={auction.Nft.s3Path}></Media>
      <div className='drop-page__grid-item-info'>
        <div className='drop-page__grid-item-info-left'>
          <h1 className='drop-page__grid-item-info-drop-name'>
            {dropName} by {artistName}
          </h1>
          <h1 className='drop-page__grid-item-info-game-name'>{nftName}</h1>
        </div>
        <div className='drop-page__grid-item-info-right'>
          {!isStarted && (
            <Countdown
              endTime={startTime}
              className='drop-page__grid-item-info-countdown'
            ></Countdown>
          )}
          {isOpenForBids && (
            <Countdown
              endTime={endTime}
              className='drop-page__grid-item-info-countdown'
            ></Countdown>
          )}
        </div>
      </div>
    </div>
  );
}
