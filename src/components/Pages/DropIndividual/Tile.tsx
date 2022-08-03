import System, { SystemTypes } from '@/components/Icons/System';
import { Auction_include_Nft, Lottery_include_Nft, User } from '@/prisma/types';
import { BaseMedia } from '@/components/Media';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import PlaceBidModal from '@/components/Modals/Games/PlaceBidModal';
import useModal from '@/hooks/useModal';
import LotteryThumbnail from './LotteryThumbnail';
import shortenAddress from '@/utilities/shortenAddress';
import { useSigner } from 'wagmi';
import { useBuySingleNftMutation } from '@/store/nftsReducer';
import { toast } from 'react-toastify';

function getGameDisplayInfo(systemType: Props['systemType']) {
  let focusText: string = '';
  let Modal: typeof GetTicketModal | typeof PlaceBidModal | null = null;

  if (systemType === 'lotteries') {
    focusText = 'enter lottery';
    Modal = GetTicketModal;
  }
  if (systemType === 'drawings') {
    focusText = 'enter drawing';
    Modal = GetTicketModal;
  }
  if (systemType === 'auctions') {
    focusText = 'place bid';
    Modal = PlaceBidModal;
  }
  return { focusText, Modal };
}

interface Props {
  imgSrc: string;
  dropName: string;
  artist: User;
  editionSize: number;
  systemType: SystemTypes;
  id: number;
  lottery?: Lottery_include_Nft;
  auction?: Auction_include_Nft;
}

export default function Tile({
  imgSrc,
  lottery,
  auction,
  dropName,
  systemType,
  artist,
  editionSize,
  id,
}: Props) {
  let gameName: string = '';
  if (systemType === 'lotteries' && lottery) {
    gameName = lottery.Nfts[0].name;
  }
  if (systemType === 'drawings' && lottery) {
    gameName = lottery.Nfts[0].name;
  }
  if (systemType === 'auctions' && auction) {
    gameName = auction.Nft.name;
  }
  const { focusText, Modal } = getGameDisplayInfo(systemType);
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className='drop-page__grid-item' onClick={openModal}>
      <div className='drop-page__grid-item-header'>
        <h1 className='drop-page__grid-item-header-left'>edition size: {editionSize}</h1>
        <div className='drop-page__grid-item-header-right'>
          system:{' '}
          <div className='drop-page__grid-item-systems-icon'>
            <System type={systemType}></System>
          </div>
        </div>
      </div>
      <div className='drop-page__grid-item-img'>
        {lottery && lottery?.Nfts.length > 1 ? (
          <LotteryThumbnail lottery={lottery}></LotteryThumbnail>
        ) : (
          <BaseMedia src={imgSrc}></BaseMedia>
        )}
        <div className='drop-page__grid-item-focus'>{focusText}</div>
      </div>
      <div className='drop-page__grid-item-info'>
        <h1 className='drop-page__grid-item-info-drop-name'>
          {dropName} by {artist.username}
        </h1>
        <h1 className='drop-page__grid-item-info-game-name'>{gameName}</h1>
      </div>
    </div>
  );
}
