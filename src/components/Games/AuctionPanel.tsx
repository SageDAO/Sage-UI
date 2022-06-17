import { useAccount, useBalance } from 'wagmi';
import { User } from '@prisma/client';
import { Auction_include_Nft } from '@/prisma/types';
import { useGetAuctionStateQuery } from '@/store/services/auctionsReducer';
import { useGetUserDisplayInfoQuery } from '@/store/services/user';
import PlaceBidModal from '@/components/Modals/Games/PlaceBidModal';
import useModal from '@/hooks/useModal';
import Status from '@/components/Status';
import PlaceBidButton from './PlaceBidButton';
import { PfpImage } from '@/components/Media';
import { parameters } from '@/constants/config';

interface Props {
  auction: Auction_include_Nft;
  artist: User;
}

type GameStatus = 'Done' | 'Live' | 'Error';

function computeGameStatus(start: number, end: number, settled: boolean): GameStatus {
  if (settled) {
    return 'Done';
  }
  if (end < Date.now()) {
    return 'Done';
  }
  if (start < Date.now()) {
    return 'Live';
  }
  return 'Error';
}

// styles/components/_game-panel.scss
export default function AuctionPanel({ auction, artist }: Props) {
  const {
    isOpen: isPlaceBidModalOpen,
    closeModal: closePlaceBidModal,
    openModal: openPlaceBidModal,
  } = useModal();
  const { data: accountData } = useAccount();
  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
  const { data: highestBidder } = useGetUserDisplayInfoQuery(auctionState?.highestBidder!, {
    skip: !(
      auctionState?.highestBidder &&
      auctionState?.highestBidder != '0x0000000000000000000000000000000000000000'
    ),
  });
  const { ASHTOKEN_ADDRESS } = parameters;
  const { data: userBalance } = useBalance({
    addressOrName: accountData?.address,
    token: ASHTOKEN_ADDRESS,
  });
  const status: GameStatus = auctionState
    ? computeGameStatus(auction.startTime.getTime(), auctionState!.endTime, auctionState!.settled)
    : 'Error';
  return (
    <div className='game-panel'>
      <PlaceBidModal
        isOpen={isPlaceBidModalOpen}
        closeModal={closePlaceBidModal}
        auction={auction}
        artist={artist}
      />
      <div className='game-panel__header'>
        <h1 className='game-panel__header-title'>Auction</h1>
        <div className='game-panel__balance-label'>
          Balance
          <div className='game-panel__balance'>
            {(userBalance && userBalance.formatted + ' ' + userBalance.symbol)}
          </div>
        </div>
      </div>
      <div className='game-panel__pricing'>
        <div className='game-panel__pricing-item'>
          <h1 className='game-panel__pricing-label'>Current Bid</h1>
          <div className='game-panel__price'>
            {auctionState?.highestBidNumber || 0}
            <div className='game-panel__price-unit'>ASH</div>
          </div>
        </div>
        {highestBidder && (
          <div className='game-panel__pricing-item'>
            <h1 className='game-panel__pricing-label'>Highest Bidder</h1>
            <div className='game-panel__highest-bidder'>
              <div className='game-panel__highest-bidder-pfp'>
                <PfpImage src={highestBidder?.profilePicture}  />
              </div>
              <div className='game-panel__highest-bidder-name'>
                {highestBidder?.displayName}
                <div className='game-panel__highest-bidder-username'>
                  @{highestBidder?.username}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='game-panel__actions'>
        <div className='game-panel__btn-container'>
          <PlaceBidButton pending={false} auction={auction} onClick={openPlaceBidModal} />
        </div>
        <Status
          endTime={auctionState?.endTime || auction.endTime}
          settled={auctionState?.settled || false}
          startTime={auction.startTime}
        />
        <h1 className='game-panel__rules'>Auction Rules</h1>
      </div>
    </div>
  );
}
