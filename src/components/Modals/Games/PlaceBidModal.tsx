import { bid, BidArgs, useGetAuctionStateQuery } from '@/store/services/auctionsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import { Auction_include_Nft } from '@/prisma/types';
import type { User } from '@prisma/client';
import GamesModalHeader from './GamesModalHeader';
import Status from '@/components/Status';
import { useEffect, useState } from 'react';
import { useAccount, useBalance, useSigner } from 'wagmi';
import PlaceBidButton from '@/components/Games/PlaceBidButton';
import { Signer } from 'ethers';

interface Props extends ModalProps {
  auction: Auction_include_Nft;
  artist: User;
}

type DesiredBidValue = number;

interface State {
  desiredBidValue: DesiredBidValue;
  minBid: DesiredBidValue;
  maxBid: DesiredBidValue;
}

//@scss : '@/styles/components/_games-modal.scss'
function PlaceBidModal({ isOpen, closeModal, auction, artist }: Props) {
  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
  const initialState: State = {
    desiredBidValue: +auction.minimumPrice!,
    minBid: +auction.minimumPrice!,
    maxBid: +auction.buyNowPrice!,
  };
  const [state, setState] = useState<State>(initialState);
  const { data: accountData } = useAccount();
  const { data: signer } = useSigner();

  function handlePlaceBidClick() {
    bid({ auctionId: auction.id, amount: state.desiredBidValue, signer: signer as Signer });
  }

  function handleMaxButtonClick() {
    setState((prevState) => {
      return { ...prevState, desiredBidValue: state.maxBid };
    });
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

  let pending = false;

  useEffect(() => {
    if (!auctionState) return;
    setState((prevState) => {
      return {
        ...prevState,
        desiredBidValue: auctionState.nextMinBid,
        minBid: auctionState.nextMinBid,
      };
    });
  }, [auctionState]);

  return (
    <Modal title='Place a Bid' isOpen={isOpen} closeModal={closeModal}>
      <div className='games-modal'>
        <GamesModalHeader
          imgSrc={auction.Nft.s3Path}
          nftName={auction.Nft.name}
          nftEditions={auction.Nft.numberOfEditions}
          artist={artist}
        ></GamesModalHeader>
        <div className='games-modal__rules'>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Current Bid</div>
            <div className='games-modal__rules-value'>
              {auctionState && auctionState.highestBidNumber}
            </div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Bid extension</div>
            <div className='games-modal__rules-value'>{auctionState?.timeExtension}</div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Bid increment</div>
            <div className='games-modal__rules-value'>{auctionState?.bidIncrementPercentage}%</div>
          </div>
          <div className='games-modal__rules-divider-container'>
            <div className='games-modal__rules-divider-rectangle'></div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Minimum Bid</div>
            <div className='games-modal__rules-value'>{state.minBid}</div>
          </div>
        </div>
        <div className='games-modal__heading'>
          <h1 className='games-modal__heading-label'>Amount</h1>
          <div className='games-modal__heading-value games-modal__heading-value--blue'>
            {auction.buyNowPrice} COINS
          </div>
        </div>
        <div className='games-modal__bid-section'>
          <div className='games-modal__bid-controls'>
            <input
              type='number'
              className='games-modal__bid-input'
              value={state.desiredBidValue}
              onChange={handleBidInputChange}
              min={state.minBid}
              max={state.maxBid}
              disabled={pending}
            ></input>
            <span className='games-modal__bid-unit'>COINS</span>
            <button
              className='games-modal__bid-min-max-btn'
              disabled={pending}
              onClick={handleMinButtonClick}
            >
              min
            </button>
            <button
              className='games-modal__bid-min-max-btn'
              disabled={pending}
              onClick={handleMaxButtonClick}
            >
              max
            </button>
          </div>
          <div className='games-modal__btn-container'>
            <PlaceBidButton pending={pending} onClick={handlePlaceBidClick} auction={auction} />
          </div>
        </div>
        <div className='games-modal__status-container'>
          <Status
            endTime={auction.endTime}
            settled={auction.settled}
            startTime={auction.startTime}
          />
        </div>
      </div>
    </Modal>
  );
}

export default PlaceBidModal;
