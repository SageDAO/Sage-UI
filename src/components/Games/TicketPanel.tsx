import { Lottery_include_Nft } from '@/prisma/types';
import { useGetUserDisplayInfoQuery } from '@/store/services/user';
useGetUserDisplayInfoQuery;
import { useBalance, useAccount } from 'wagmi';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import useModal from '@/hooks/useModal';
import { Lottery, User } from '@prisma/client';
import { useGetPointsBalanceQuery, useGetEscrowPointsQuery } from '@/store/services/pointsReducer';
import Status from '@/components/Status';
import GetTicketsButton from './GetTicketsButton';
import { parameters } from '@/constants/config';
import { useSession } from 'next-auth/react';
import { useTicketCount } from '@/hooks/useTicketCount';

interface Props {
  lottery: Lottery_include_Nft;
  artist: User;
  dropName: string;
  selectedNftIndex: number;
}

// styles/components/_game-panel.scss
export default function LotteryPanel({ lottery, artist, selectedNftIndex }: Props) {
  const {
    isOpen: isTicketModalOpen,
    closeModal: closeTicketModal,
    openModal: openTicketModal,
  } = useModal();
  const { data: sessionData } = useSession();
  const walletAddress = sessionData?.address;
  const ticketCount = useTicketCount([lottery] as Lottery[], walletAddress as string);
  const { data: accountData } = useAccount();
  const { ASHTOKEN_ADDRESS } = parameters;
  const { data: userBalance } = useBalance({
    addressOrName: accountData?.address,
    token: ASHTOKEN_ADDRESS,
  });
  const { data: userPoints } = useGetPointsBalanceQuery(undefined, { skip: !accountData?.address });
  const { data: escrowPoints } = useGetEscrowPointsQuery(undefined, {
    skip: !accountData?.address,
  });
  const userBalancePoints = userPoints! - escrowPoints!;
  return (
    <div className='game-panel'>
      <GetTicketModal
        isOpen={isTicketModalOpen}
        closeModal={closeTicketModal}
        nft={lottery.Nfts[selectedNftIndex]}
        lottery={lottery}
        artist={artist}
      />
      <div className='game-panel__header'>
        <h1 className='game-panel__header-title'>Tickets</h1>
        <div className='game-panel__balance-label'>
          Balance
          {lottery.costPerTicketPoints > 0 && (
            <div className='game-panel__balance'>{userBalancePoints} PIXEL</div>
          )}
          {lottery.costPerTicketTokens > 0 && (
            <div className='game-panel__balance'>
              {userBalance?.formatted} {userBalance?.symbol}
            </div>
          )}
        </div>
      </div>
      <div className='game-panel__pricing'>
        <div className='game-panel__pricing-item'>
          <h1 className='game-panel__pricing-label'>Pricing</h1>
          <div className='game-panel__price'>
            {lottery.costPerTicketPoints > 0 && (
              <span className='game-panel__price-item'>
                {lottery.costPerTicketPoints}
                <div className='game-panel__price-unit'>PIXEL</div>
              </span>
            )}
            {Boolean(lottery.costPerTicketTokens > 0 && lottery.costPerTicketPoints > 0) && (
              <span className='game-panel__price-unit'>{' + '}</span>
            )}
            {lottery.costPerTicketTokens > 0 && (
              <span className='game-panel__price-item'>
                {lottery.costPerTicketTokens}
                <div className='game-panel__price-unit'>ASH</div>
              </span>
            )}
          </div>
        </div>
      </div>
      <p className='game-panel__extra-info'>
        This is a fair drop mechanic. Buy purchasing one or more tickets for this drop, you have the
        opportunity to be selected to buy this NFT. Losing tickets will be refunded.
      </p>
      <div className='game-panel__actions'>
        <div className='game-panel__btn-container'>
          <GetTicketsButton
            pending={false}
            onClick={openTicketModal}
            startTime={lottery.startTime}
            endTime={lottery.endTime}
          />
        </div>
        <div className='game-panel__lottery-info'>
          <Status endTime={lottery.endTime} startTime={lottery.startTime} settled={false} />
          <div className='game-panel__user-ticket-count'>
            you have {ticketCount[lottery.id]} tickets
          </div>
        </div>
      </div>
    </div>
  );
}
