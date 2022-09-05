import { BaseMedia } from '@/components/Media/BaseMedia';
import { Lottery_include_Nft, User } from '@/prisma/types';
import React from 'react';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import useModal from '@/hooks/useModal';
import TileHeader from './TileHeader';
import LotteryThumbnail from './LotteryThumbnail';
import Countdown from '@/components/Countdown';

interface Props {
  imgSrc: string;
  dropName: string;
  artist: User;
  editionSize: number;
  lottery: Lottery_include_Nft;
  tickets: number;
}
export default function LotteryTile({
  artist,
  dropName,
  imgSrc,
  editionSize,
  lottery,
  tickets,
}: Props) {
  const { isOpen, closeModal, openModal } = useModal();
  const now = new Date();
  const isStarted = new Date(lottery.startTime) < now;
  const isEnded = new Date(lottery.endTime) < now;
  const isLive = isStarted && !isEnded;
  return (
    <div className='drop-page__grid-item' onClick={openModal}>
      <GetTicketModal
        lottery={lottery}
        dropName={dropName}
        artist={artist}
        isOpen={isOpen}
        ticketCount={tickets}
        closeModal={closeModal}
        systemType={'lotteries'}
      ></GetTicketModal>
      <TileHeader systemType={'lotteries'} editionSize={editionSize}></TileHeader>
      <div className='drop-page__grid-item-media-container'>
        <LotteryThumbnail lottery={lottery}></LotteryThumbnail>
        <div className='drop-page__grid-item-img-overlay'></div>
        <div className='drop-page__grid-item-focus'>
          {lottery.endTime.getTime() > new Date().getTime() ? 'enter lottery' : 'results'}
        </div>
      </div>
      <div className='drop-page__grid-item-info'>
        <div className='drop-page__grid-item-info-left'>
          <h1 className='drop-page__grid-item-info-drop-name'>
            {dropName} by {artist.username}
          </h1>
          <h1 className='drop-page__grid-item-info-game-name'>{'lottery'}</h1>
          {tickets > 0 && (
            <h1 className='drop-page__grid-item-info-tickets'>
              you have {tickets} {tickets > 1 ? 'entries' : 'entry'}
            </h1>
          )}
        </div>
        <div className='drop-page__grid-item-info-right'>
          {isStarted && (
            <Countdown
              endTime={lottery.endTime}
              className='drop-page__grid-item-info-countdown'
            ></Countdown>
          )}
          {!isStarted && (
            <Countdown
              endTime={lottery.startTime}
              className='drop-page__grid-item-info-countdown'
            ></Countdown>
          )}
        </div>
      </div>
    </div>
  );
}
