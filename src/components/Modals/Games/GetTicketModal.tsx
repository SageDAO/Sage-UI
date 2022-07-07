import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Signer } from 'ethers';
import { User } from '@prisma/client';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Lottery_include_Nft, Nft } from '@/prisma/types';
import { BuyTicketRequest, useBuyTicketsMutation } from '@/store/lotteriesReducer';
import { useGetEarnedPointsQuery } from '@/store/pointsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import Status from '@/components/Status';
import GetTicketsButton from '@/components/Games/GetTicketsButton';
import GamesModalHeader from './GamesModalHeader';

interface Props extends ModalProps {
  lottery: Lottery_include_Nft;
  nft: Nft;
  artist: User;
}

//@scss : '@/styles/components/_games-modal.scss'
function GetTicketModal({ isOpen, closeModal, lottery, artist, nft }: Props) {
  const [desiredTicketAmount, setDesiredTicketAmount] = useState<number>(1);
  const { data: sessionData } = useSession();
  const [buyTickets, { isLoading }] = useBuyTicketsMutation();
  const { data: earnedPoints } = useGetEarnedPointsQuery(undefined, {
    skip: !sessionData,
  });
  const { data: signer } = useSigner();
  const hasMaxTicketsPerUser: boolean = lottery.maxTicketsPerUser > 0;
  //ui event handlers
  function handleTicketSubClick() {
    if (desiredTicketAmount == 0) {
      return;
    }
    setDesiredTicketAmount((prevState) => prevState - 1);
  }

  function handleTicketAddClick() {
    if (hasMaxTicketsPerUser && Boolean(desiredTicketAmount + 1 > lottery.maxTicketsPerUser)) {
      return;
    }
    setDesiredTicketAmount((prevState) => prevState + 1);
  }

  function handleTicketInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = +e.target.value;
    if (val < 0) {
      return;
    }
    if (val > lottery.maxTicketsPerUser) {
      e.currentTarget.value = String(lottery.maxTicketsPerUser);
      setDesiredTicketAmount(lottery.maxTicketsPerUser);
    }
    setDesiredTicketAmount(+e.target.value);
  }

  // ? lottery db field will only have one tier?
  const getPriceCoins = (): bigint => {
    return BigInt(lottery.costPerTicketTokens * 1000) * BigInt(10 ** 15);
  };

  // ? lottery db field will only have one tier?
  const getPricePoints = (): bigint => {
    return BigInt(lottery.costPerTicketPoints);
  };

  const handleBuyTicketClick = async () => {
    const pricePoints = getPricePoints();

    if (!earnedPoints) {
      toast.error('Points info unavailable');
      return;
    }

    const request: BuyTicketRequest = {
      lotteryId: lottery.id,
      numberOfTickets: desiredTicketAmount,
      ticketCostPoints: pricePoints,
      ticketCostCoins: getPriceCoins(),
      signer: signer as Signer,
      earnedPoints: earnedPoints,
    };
    await buyTickets(request);
  };

  return (
    <Modal title='Get a Ticket' isOpen={isOpen} closeModal={closeModal}>
      <div className='games-modal'>
        <GamesModalHeader
          src={nft.s3Path}
          isVideo={nft.isVideo}
          nftName={nft.name}
          nftEditions={nft.numberOfEditions}
          artist={artist}
        ></GamesModalHeader>
        <div className='games-modal__rules'>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Drawing For</div>
            <div className='games-modal__rules-value'>{nft.name}</div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Refundable</div>
            <div className='games-modal__rules-value'>{lottery.isRefundable ? 'Yes' : 'No'}</div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Drawing</div>
            <div className='games-modal__rules-value'>{lottery.endTime.toLocaleDateString()}</div>
          </div>
        </div>
        <div className='games-modal__heading'>
          <h1 className='games-modal__heading-label'>Price per ticket</h1>
          <div className='games-modal__heading-value games-modal__heading-value--green'>
            {lottery.costPerTicketPoints} PIXEL
          </div>
        </div>
        <div className='games-modal__tickets-section'>
          <div className='games-modal__tickets-inner'>
            <div className='games-modal__tickets-controls'>
              <button
                onClick={handleTicketSubClick}
                className='games-modal__tickets-sub'
                disabled={isLoading}
              >
                -
              </button>
              <input
                type='number'
                className='games-modal__tickets-input'
                value={desiredTicketAmount}
                onChange={handleTicketInputChange}
                min={1}
                max={hasMaxTicketsPerUser ? lottery.maxTicketsPerUser : undefined}
                disabled={isLoading}
              ></input>
              <button
                onClick={handleTicketAddClick}
                className='games-modal__tickets-add'
                disabled={isLoading}
              >
                +
              </button>
            </div>
          </div>
          <div className='games-modal__tickets-total'>
            <span className='games-modal__tickets-total-label'>Total </span>
            {lottery.costPerTicketPoints > 0 && (
              <span>{desiredTicketAmount * lottery.costPerTicketPoints} PIXEL</span>
            )}
            {lottery.costPerTicketPoints > 0 && lottery.costPerTicketTokens > 0 && (
              <span>{' + '}</span>
            )}
            {lottery.costPerTicketTokens > 0 && (
              <span>{desiredTicketAmount * lottery.costPerTicketTokens} ASH</span>
            )}
          </div>
          <div className='games-modal__btn-container'>
            <GetTicketsButton
              onClick={handleBuyTicketClick}
              pending={isLoading}
              startTime={lottery.startTime}
              endTime={lottery.endTime}
            />
          </div>
        </div>
        <div className='games-modal__status-container'>
          <Status startTime={lottery.startTime} endTime={lottery.endTime} settled={false} />
        </div>
      </div>
    </Modal>
  );
}

export default GetTicketModal;
