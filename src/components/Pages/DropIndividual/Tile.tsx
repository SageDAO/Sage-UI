import System, { SystemTypes } from '@/components/Icons/System';
import { Auction_include_Nft, Lottery_include_Nft, User } from '@/prisma/types';
import { BaseMedia } from '@/components/Media';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import PlaceBidModal from '@/components/Modals/Games/PlaceBidModal';
import useModal from '@/hooks/useModal';

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
  const { isOpen, openModal, closeModal } = useModal();
  const { focusText, Modal } = getGameDisplayInfo(systemType);
  return (
    <div className='drop-page__grid-item' onClick={openModal}>
      {Modal && (
        <Modal
          dropName={dropName}
          artist={artist}
          auction={auction as Auction_include_Nft}
          lottery={lottery as Lottery_include_Nft}
          isOpen={isOpen}
          closeModal={closeModal}
        ></Modal>
      )}
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
        <BaseMedia src={imgSrc}></BaseMedia>
        <div className='drop-page__grid-item-focus'>{focusText}</div>
      </div>
      <div className='drop-page__grid-item-info'>
        <h1 className='drop-page__grid-item-info-drop-name'>
          {dropName} by {artist.displayName}
        </h1>
        <h1 className='drop-page__grid-item-info-game-name'>{gameName}</h1>
      </div>
    </div>
  );
}