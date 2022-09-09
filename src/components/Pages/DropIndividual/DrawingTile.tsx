import { BaseMedia } from '@/components/Media/BaseMedia';
import { Lottery_include_Nft, User } from '@/prisma/types';
import React from 'react';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import useModal from '@/hooks/useModal';
import TileHeader from './TileHeader';
import Countdown from '@/components/Countdown';
import { transformTitle } from '@/utilities/strings';

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
        systemType='drawing'
      ></GetTicketModal>
      <TileHeader editionSize={editionSize} systemType='drawing'></TileHeader>
      <div className='drop-page__grid-item-media-container'>
        <BaseMedia className='drop-page__grid-item-media-src' src={imgSrc}></BaseMedia>
        <div className='drop-page__grid-item-media-overlay'></div>
        <div className='drop-page__grid-item-focus'>
          {drawing.endTime.getTime() > new Date().getTime() ? 'enter drawing' : 'results'}
        </div>
      </div>
      <div className='drop-page__grid-item-info'>
        <div className='drop-page__grid-item-info-left'>
          <h1 className='drop-page__grid-item-info-drop-name'>
            {transformTitle(dropName)} by {artist.username}
          </h1>
          <h1 className='drop-page__grid-item-info-game-name'>
            {transformTitle(drawing.Nfts[0].name)}
          </h1>
          {tickets > 0 && (
            <h1 className='drop-page__grid-item-info-tickets'>
              You have {tickets} {tickets > 1 ? 'entries' : 'entry'}
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
