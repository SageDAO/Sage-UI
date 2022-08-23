import { BaseMedia } from '@/components/Media/BaseMedia';
import { Lottery_include_Nft, User } from '@/prisma/types';
import React from 'react';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import useModal from '@/hooks/useModal';
import TileHeader from './TileHeader';
import Countdown from '@/components/Countdown';

interface Props {
  imgSrc: string;
  dropName: string;
  artist: User;
  editionSize: number;
  drawing: Lottery_include_Nft;
  tickets: number;
}
export default function DrawingTile({
  artist,
  dropName,
  imgSrc,
  editionSize,
  drawing,
  tickets,
}: Props) {
  const { isOpen, closeModal, openModal } = useModal();
  const now = new Date();
  const isStarted = new Date(drawing.startTime) < now;
  const isEnded = new Date(drawing.endTime) < now;
  const isLive = isStarted && !isEnded;
  return (
    <div onClick={openModal} className='drop-page__grid-item'>
      <GetTicketModal
        lottery={drawing}
        dropName={dropName}
        artist={artist}
        isOpen={isOpen}
        closeModal={closeModal}
        ticketCount={tickets}
        systemType='drawings'
      ></GetTicketModal>
      <TileHeader editionSize={editionSize} systemType='drawings'></TileHeader>
      <div className='drop-page__grid-item-img'>
        <BaseMedia src={imgSrc}></BaseMedia>
        <div className='drop-page__grid-item-focus'>
          {drawing.endTime.getTime() > new Date().getTime() ? 'enter drawing' : 'view results'}
        </div>
      </div>
      <div className='drop-page__grid-item-info'>
        <div className='drop-page__grid-item-info-left'>
          <h1 className='drop-page__grid-item-info-drop-name'>
            {dropName} by {artist.username}
          </h1>
          <h1 className='drop-page__grid-item-info-game-name'>{drawing.Nfts[0].name}</h1>
          {tickets > 0 && (
            <h1 className='drop-page__grid-item-info-tickets'>
              you have {tickets} ticket{tickets > 1 ? 's' : ''}
            </h1>
          )}
        </div>
        <div className='drop-page__grid-item-info-right'>
          {isStarted && (
            <Countdown
              endTime={drawing.endTime}
              className='drop-page__grid-item-info-countdown'
            ></Countdown>
          )}
          {!isStarted && (
            <Countdown
              endTime={drawing.startTime}
              className='drop-page__grid-item-info-countdown'
            ></Countdown>
          )}
        </div>
      </div>
    </div>
  );
}
