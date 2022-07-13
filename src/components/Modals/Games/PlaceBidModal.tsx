import { useEffect, useState } from 'react';
import { Signer } from 'ethers';
import { useSigner } from 'wagmi';
import { useGetAuctionStateQuery, usePlaceBidMutation } from '@/store/auctionsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import { Auction_include_Nft } from '@/prisma/types';
import type { User } from '@prisma/client';
import GamesModalHeader from './GamesModalHeader';
import Status from '@/components/Status';
import { BaseMedia } from '@/components/Media';
import Image from 'next/image';
import System from '@/components/Icons/System';

interface Props extends ModalProps {
  auction: Auction_include_Nft;
  artist: User;
  dropName: string;
}

type DesiredBidValue = number;

interface State {
  desiredBidValue: DesiredBidValue;
  minBid: DesiredBidValue;
}

const initialState: State = {
  desiredBidValue: 0,
  minBid: 0,
};

//@scss : '@/styles/components/_games-modal.scss'
function PlaceBidModal({ isOpen, closeModal, auction, artist, dropName }: Props) {
  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
  const [state, setState] = useState<State>(initialState);
  const [placeBid, { isLoading: isPlaceBidLoading }] = usePlaceBidMutation();
  const { data: signer } = useSigner();

  function handlePlaceBidClick() {
    placeBid({ auctionId: auction.id, amount: state.desiredBidValue, signer: signer as Signer });
  }

  function handleMinButtonClick() {
    setState((prevState) => {
      return { ...prevState, desiredBidValue: state.minBid };
    });
  }

  function handleBidInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, desiredBidValue: +e.target.value };
    });
  }

  function handleNewAuctionState() {
    if (!auctionState) return;
    setState((prevState) => {
      return {
        ...prevState,
        desiredBidValue: auctionState.nextMinBid,
        minBid: auctionState.nextMinBid,
      };
    });
  }

  function handleStartingBid() {
    if (!auction.minimumPrice) return;
    if (auctionState?.nextMinBid) return;
    setState((prevState) => {
      return {
        ...prevState,
        desiredBidValue: Number(auction.minimumPrice),
        minBid: Number(auction.minimumPrice),
      };
    });
  }

  useEffect(() => {
    handleStartingBid();
  }, []);

  useEffect(() => {
    handleNewAuctionState();
  }, [auctionState]);

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
            <BaseMedia src={auction.Nft.s3Path} />
          </div>
          <div className='games-modal__main-content'>
            <h1 className='games-modal__drop-name'>{dropName}</h1>
            <h1 className='games-modal__game-name'>{auction.Nft.name}</h1>
            <p className='games-modal__game-name'>{auction.Nft.description}</p>
            <div className='games-modal__system'>
              <div className='games-modal__system-icon-container'>
                <System type='auctions'></System>
              </div>
              <h1 className='games-modal__system-info'>This is an auction</h1>
            </div>
            <h1 className='games-modal__highest-bid-label'>current highest bid</h1>
            <h1 className='games-modal__highest-bid-value'>{auctionState?.highestBidNumber} ASH</h1>
            <button  className='games-modal__place-bid-button' onClick={handlePlaceBidClick}>place bid</button>
          </div>
        </section>
        <section className='games-modal__bid-history-section'>
          <button className='games-modal__see-bid-history-button'>click here to see bids</button>
        </section>
      </div>
    </Modal>
  );
}

export default PlaceBidModal;
