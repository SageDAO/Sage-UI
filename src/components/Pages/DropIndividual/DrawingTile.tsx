import { BaseMedia } from '@/components/Media/BaseMedia';
import { Lottery_include_Nft } from '@/prisma/types';
import React from 'react';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import useModal from '@/hooks/useModal';
import TileHeader from './TileHeader';
import Countdown from '@/components/Countdown';
import useLottery from '@/hooks/useLottery';

interface Props {
  dropName: string;
  artistName: string;
  drawing: Lottery_include_Nft;
  tickets: number;
}
export default function DrawingTile({ artistName, dropName, drawing, tickets }: Props) {
  const { isOpen, closeModal, openModal } = useModal();
  const { isStarted, isLive, mediaSrc, selectedNftName, selectedNftEditionsCount } = useLottery({
    lottery: drawing,
    nfts: drawing.Nfts,
  });
  return (
    <div onClick={openModal} className='drop-page__grid-item'>
      <GetTicketModal
        lottery={drawing}
        dropName={dropName}
        artistName={artistName}
        isOpen={isOpen}
        closeModal={closeModal}
        ticketCount={tickets}
        systemType='drawing'
      ></GetTicketModal>
      <TileHeader editionSize={selectedNftEditionsCount} systemType='drawing'></TileHeader>
      <div className='drop-page__grid-item-media-container'>
        <BaseMedia className='drop-page__grid-item-media-src' src={mediaSrc}></BaseMedia>
        <div className='drop-page__grid-item-media-overlay'></div>
        <div className='drop-page__grid-item-focus'>{isLive ? 'enter drawing' : 'results'}</div>
      </div>
      <div className='drop-page__grid-item-info'>
        <div className='drop-page__grid-item-info-left'>
          <h1 className='drop-page__grid-item-info-drop-name'>
            {dropName} by {artistName}
          </h1>
          <h1 className='drop-page__grid-item-info-game-name'>{selectedNftName}</h1>
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
