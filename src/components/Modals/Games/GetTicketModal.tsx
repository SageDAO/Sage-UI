import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Signer } from 'ethers';
import { useSigner } from 'wagmi';
import { Lottery_include_Nft } from '@/prisma/types';
import {
  BuyTicketRequest,
  useBuyTicketsMutation,
  useGetWinnersQuery,
  useGetRefundByLotteryQuery,
} from '@/store/lotteriesReducer';
import { useGetEarnedPointsQuery } from '@/store/pointsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import { BaseMedia } from '@/components/Media/BaseMedia';
import System, { SystemTypes } from '@/components/Icons/System';
import LotterySlider from '@/components/Games/LotterySlider';
import PlusSVG from '@/public/icons/plus.svg';
import MinusSVG from '@/public/icons/minus.svg';
import SageFullLogo from '@/public/branding/sage-full-logo.svg';
import CloseSVG from '@/public/interactive/close.svg';
import shortenAddress from '@/utilities/shortenAddress';
import Countdown from '@/components/Countdown';
import { transformTitle } from '@/utilities/strings';
import ClaimRefundButton from '@/components/Pages/Profile/ClaimRefundButton';
import CheckSVG from '@/public/icons/check.svg';
import { useRouter } from 'next/router';
import useSAGEAccount from '@/hooks/useSAGEAccount';

interface Props extends ModalProps {
  lottery: Lottery_include_Nft;
  artistName: string;
  dropName: string;
  ticketCount: number;
  systemType: SystemTypes;
}

interface ErrorState {
  message: string;
  isError: boolean;
}

const INITIAL_ERROR_STATE: ErrorState = {
  message: '',
  isError: false,
};

const DEFAULT_MAX_TICKETS = 300;

//@scss : '@/styles/components/_games-modal.scss'
function GetTicketModal({
  isOpen,
  dropName,
  closeModal,
  lottery,
  artistName,
  ticketCount,
  systemType,
}: Props) {
  const router = useRouter();
  const { sessionData } = useSAGEAccount();
  const walletAddress = sessionData?.address;
  const { data: signer } = useSigner();
  const [desiredTicketAmount, setDesiredTicketAmount] = useState<number>(1);
  const [selectedNftIndex, setSelectedNftIndex] = useState<number>(0);
  const [errorState, setErrorState] = useState<ErrorState>(INITIAL_ERROR_STATE);
  const { data: earnedPoints } = useGetEarnedPointsQuery(undefined, { skip: !sessionData });
  const [buyTickets, { isLoading: isBuyTicketsLoading }] = useBuyTicketsMutation();

  const now = new Date().getTime();
  const isStarted = lottery.startTime.getTime() < now;
  const isEnded = lottery.endTime.getTime() < now;
  const isActive = isStarted && !isEnded;

  const { data: winners } = useGetWinnersQuery(lottery.id, {
    skip: !isEnded,
    pollingInterval: 60000,
  });
  const { data: refund } = useGetRefundByLotteryQuery(lottery.id, {
    skip: !isEnded,
    pollingInterval: 60000,
  });

  const hasMaxTicketsPerUser: boolean = lottery.maxTicketsPerUser > 0;
  const editionsCount: number = lottery.Nfts[selectedNftIndex].numberOfEditions;
  const editionsText: string = editionsCount > 1 ? 'editions' : 'edition';

  function handleTicketSubClick() {
    if (desiredTicketAmount == 1) {
      return;
    }
    setDesiredTicketAmount((prevState) => prevState - 1);
  }

  function validateDesiredTicketAmount() {
    if (desiredTicketAmount == 0) {
      setErrorState({ message: 'cannot buy zero entries', isError: true });
      return;
    }
    if (desiredTicketAmount < 1) {
      setErrorState({ message: 'cannot buy negative entries', isError: true });
      return;
    }
    if (hasMaxTicketsPerUser && desiredTicketAmount > lottery.maxTicketsPerUser - ticketCount) {
      setErrorState({ message: 'max entries per user reached', isError: true });
      return;
    }

    if (lottery.maxTickets > 0 && desiredTicketAmount > lottery.maxTickets) {
      setErrorState({ message: 'max entries reached', isError: true });
      return;
    }

    setErrorState(INITIAL_ERROR_STATE);
  }

  function handleTicketAddClick() {
    if (Boolean(desiredTicketAmount + 1 > (lottery.maxTickets || DEFAULT_MAX_TICKETS))) {
      setDesiredTicketAmount(lottery.maxTickets || DEFAULT_MAX_TICKETS);
      return;
    }
    setDesiredTicketAmount((prevState) => prevState + 1);
  }

  function handleTicketInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = +e.target.value;
    if (val > DEFAULT_MAX_TICKETS && lottery.maxTicketsPerUser !== 0) {
      e.currentTarget.value = String(lottery.maxTickets || DEFAULT_MAX_TICKETS);
      setDesiredTicketAmount(lottery.maxTickets || DEFAULT_MAX_TICKETS);
    }

    setDesiredTicketAmount(+e.target.value);
  }

  const handleBuyTicketClick = async () => {
    const getPriceCoins = (): bigint => {
      return BigInt(lottery.costPerTicketTokens * 1000) * BigInt(10 ** 15);
    };
    const getPricePoints = (): bigint => {
      return BigInt(lottery.costPerTicketPoints);
    };
    const pricePoints = getPricePoints();

    try {
      const request: BuyTicketRequest = {
        lotteryId: lottery.id,
        numTickets: desiredTicketAmount,
        ticketCostPoints: pricePoints.toString(),
        ticketCostTokens: getPriceCoins().toString(),
        signer: signer as Signer,
        earnedPoints: earnedPoints,
      };
      await buyTickets(request);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    validateDesiredTicketAmount();
  }, [desiredTicketAmount, ticketCount]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className='games-modal'>
        <section className='games-modal__header'>
          <SageFullLogo className='games-modal__sage-logo' />
          <button className='games-modal__close-button'>
            <CloseSVG onClick={closeModal} className='games-modal__close-button-svg' />
          </button>
        </section>
        <section className='games-modal__body'>
          <div className='games-modal__main'>
            <div className='games-modal__main-img-container'>
              {systemType === 'lottery' ? (
                <LotterySlider
                  nfts={lottery.Nfts}
                  selectedNftIndex={selectedNftIndex}
                  setSelectedNftIndex={setSelectedNftIndex}
                ></LotterySlider>
              ) : (
                <BaseMedia
                  src={'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_desktop.mp4'}
                  // isZoomable={true}
                />
              )}
              {isActive && (
                <Countdown endTime={lottery.endTime} className='games-modal__countdown'></Countdown>
              )}
            </div>
            <div className='games-modal__main-content'>
              <span className='games-modal__drop-name'>
                {dropName} by {artistName}
                <span className='games-modal__editions-tag--mobile'>
                  {editionsCount} {editionsText}
                </span>
              </span>
              <h1 className='games-modal__game-name'>
                {transformTitle(lottery.Nfts[selectedNftIndex].name)}
              </h1>
              <p className='games-modal__game-description'>
                {lottery.Nfts[selectedNftIndex].description ||
                  'This artwork has no description provided.'}
              </p>
              <div className='games-modal__system'>
                <div className='games-modal__system-icon-container'>
                  <System type={systemType}></System>
                </div>
                <h1 className='games-modal__system-info'>
                  This is a fair drop mechanic. By purchasing one or more tickets for this drop, you
                  have the opportunity to be selected to buy this NFT. Losing tickets will be
                  refunded.
                </h1>
              </div>

              {!isStarted && !isEnded && (
                <div className='games-modal__upcoming-section'>
                  <h1 className='games-modal__countdown-label'>Starts in</h1>
                  <Countdown
                    endTime={lottery.startTime}
                    className='games-modal__countdown'
                  ></Countdown>
                </div>
              )}

              {isStarted && !isEnded && (
                <div className='games-modal__live-section'>
                  <div className='games-modal__ticket-cost-group'>
                    <h1 className='games-modal__ticket-cost-label'>entry cost</h1>
                    <h1 className='games-modal__ticket-cost-value'>
                      {lottery.costPerTicketTokens * desiredTicketAmount} ASH
                      {lottery.costPerTicketPoints > 0 &&
                        ` + ${lottery.costPerTicketPoints * desiredTicketAmount} PIXEL`}
                    </h1>
                  </div>
                  <div className='games-modal__tickets-controls'>
                    <MinusSVG onClick={handleTicketSubClick} className='games-modal__tickets-sub' />
                    <input
                      type='number'
                      onChange={handleTicketInputChange}
                      min={1}
                      max={DEFAULT_MAX_TICKETS}
                      className='games-modal__tickets-input'
                      value={desiredTicketAmount}
                    />
                    <PlusSVG onClick={handleTicketAddClick} className='games-modal__tickets-add' />
                  </div>
                  <button
                    disabled={isBuyTicketsLoading || errorState.isError}
                    onClick={handleBuyTicketClick}
                    className='games-modal__buy-tickets-button'
                  >
                    {errorState.isError ? errorState.message : 'Buy Entries'}
                  </button>
                </div>
              )}
              {winners && winners.length > 0 && (
                <>
                  <h1 className='games-modal__winners-label'>
                    winner{winners.length > 1 ? 's' : ''}
                  </h1>
                  <div className='games-modal__winners-list'>
                    {winners.map((winner: any) => (
                      <div key={winner}>
                        {winner.User.username ? winner.User.username : winner.winnerAddress}
                        {walletAddress && walletAddress == winner.winnerAddress && (
                          <>
                            &nbsp; &nbsp;
                            <button
                              onClick={() => router.push('/profile?notifications')}
                              className='notifications-panel__interact-button'
                            >
                              claim
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {refund && (
                <>
                  <h1 className='games-modal__winners-label'>refund</h1>
                  <div className='games-modal__winners-list'>
                    {refund.refundableTokens} ASH &nbsp; &nbsp;
                    <ClaimRefundButton refund={refund} />
                  </div>
                </>
              )}
            </div>
          </div>
          <span className='games-modal__editions-tag--desktop'>
            {editionsCount} {editionsText}
          </span>
        </section>
      </div>
    </Modal>
  );
}

export default GetTicketModal;
