import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Signer } from 'ethers';
import { User } from '@prisma/client';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Lottery_include_Nft } from '@/prisma/types';
import { BuyTicketRequest, useBuyTicketsMutation } from '@/store/lotteriesReducer';
import { useGetEarnedPointsQuery } from '@/store/pointsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import Status from '@/components/Status';
import GetTicketsButton from '@/components/Games/GetTicketsButton';
import GamesModalHeader from './GamesModalHeader';
import Image from 'next/image';
import { BaseMedia } from '@/components/Media';
import System, { SystemTypes } from '@/components/Icons/System';

interface Props extends ModalProps {
  lottery: Lottery_include_Nft;
  artist: User;
  dropName: string;
}

//@scss : '@/styles/components/_games-modal.scss'
function GetTicketModal({ isOpen, dropName, closeModal, lottery, artist }: Props) {
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

  const systemType: SystemTypes = lottery.Nfts.length > 1 ? 'lotteries' : 'drawings';

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className='games-modal'>
        <section className='games-modal__header'>
          <div className='games-modal__sage-logo'>
            <Image src={'/branding/sage-full-logo.svg'} width={170} height={40} />
          </div>
        </section>
        <section className='games-modal__body'>
          <div className='games-modal__main-img-container'>
            <BaseMedia src={lottery.Nfts[0].s3Path} />
          </div>
          <div className='games-modal__main-content'>
            <h1 className='games-modal__drop-name'>{dropName}</h1>
            <h1 className='games-modal__game-name'>{lottery.Nfts[0].name}</h1>
            <p className='games-modal__game-name'>{lottery.Nfts[0].description}</p>
            <div className='games-modal__system'>
              <div className='games-modal__system-icon-container'>
                <System type={systemType}></System>
              </div>
              <h1 className='games-modal__system-info'>
                This is a fair drop mechanic. Buy purchasing one or more tickets for this drop, you
                have the opportunity to be selected to buy this NFT. Losing tickets will be
                refunded.
              </h1>
            </div>
            <h1 className='games-modal__ticket-cost-label'>ticket cost</h1>
            <h1 className='games-modal__ticket-cost-value'>
              {lottery.costPerTicketTokens} ASH + {lottery.costPerTicketTokens} PIXELS
            </h1>
            <button onClick={handleBuyTicketClick} className='games-modal__buy-tickets-button'>
              Buy Tickets
            </button>
          </div>
        </section>
      </div>
    </Modal>
  );
}

export default GetTicketModal;
