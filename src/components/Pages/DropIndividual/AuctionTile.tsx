import { BaseMedia } from '@/components/Media';
import PlaceBidModal from '@/components/Modals/Games/PlaceBidModal';
import useModal from '@/hooks/useModal';
import { Auction_include_Nft, User } from '@/prisma/types';
import React from 'react';
import TileHeader from './TileHeader';

interface Props {
  imgSrc: string;
  dropName: string;
  artist: User;
  editionSize: number;
  auction: Auction_include_Nft;
}
export default function AuctionTile({ artist, dropName, imgSrc, editionSize, auction }: Props) {
  const focusText = 'place bid';
  const { isOpen, closeModal, openModal } = useModal();
  return (
    <div onClick={openModal} className='drop-page__grid-item'>
      <PlaceBidModal
        auction={auction}
        artist={artist}
        dropName={dropName}
        isOpen={isOpen}
        closeModal={closeModal}
      />
      <TileHeader editionSize={editionSize} systemType='auctions' />
      <div className='drop-page__grid-item-img'>
        <BaseMedia src={imgSrc} />
        <div className='drop-page__grid-item-focus'>{focusText}</div>
      </div>
      <div className='drop-page__grid-item-info'>
        <h1 className='drop-page__grid-item-info-drop-name'>
          {dropName} by {artist.displayName}
        </h1>
        <h1 className='drop-page__grid-item-info-game-name'>{auction.Nft.name}</h1>
      </div>
    </div>
  );
}