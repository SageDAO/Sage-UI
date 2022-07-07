import { useEffect, useState } from 'react';
import { Signer } from 'ethers';
import { useSigner } from 'wagmi';
import { useGetAuctionStateQuery, usePlaceBidMutation } from '@/store/auctionsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import { Auction_include_Nft } from '@/prisma/types';
import type { User } from '@prisma/client';
import GamesModalHeader from './GamesModalHeader';
import Status from '@/components/Status';
import PlaceBidButton from '@/components/Games/PlaceBidButton';

interface Props extends ModalProps {
  auction: Auction_include_Nft;
  artist: User;
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
function PlaceBidModal({ isOpen, closeModal, auction, artist }: Props) {
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
    <Modal title='Place a Bid' isOpen={isOpen} closeModal={closeModal}>
      <div className='games-modal'>
        <GamesModalHeader
          src={auction.Nft.s3Path}
          isVideo={auction.Nft.isVideo}
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
            <div className='games-modal__rules-value'>
              {auctionState?.timeExtension! / 60} minutes
            </div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Bid increment</div>
            <div className='games-modal__rules-value'>
              {auctionState?.bidIncrementPercentage! / 100}%
            </div>
          </div>
          <div className='games-modal__rules-divider-container'>
            <div className='games-modal__rules-divider-rectangle'></div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Minimum Bid</div>
            <div className='games-modal__rules-value'>{state.minBid}</div>
          </div>
        </div>
        <div className='games-modal__heading'></div>
        <div className='games-modal__bid-section'>
          <div className='games-modal__bid-controls'>
            <input
              type='number'
              className='games-modal__bid-input'
              value={state.desiredBidValue}
              onChange={handleBidInputChange}
              min={state.minBid}
              disabled={isPlaceBidLoading}
            ></input>
            <span className='games-modal__bid-unit'>ASH</span>
            <button
              className='games-modal__bid-min-btn'
              disabled={isPlaceBidLoading}
              onClick={handleMinButtonClick}
            >
              min
            </button>
          </div>
          <div className='games-modal__btn-container'>
            <PlaceBidButton
              pending={isPlaceBidLoading}
              onClick={handlePlaceBidClick}
              auction={auction}
            />
          </div>
        </div>
        <div className='games-modal__status-container'>
          <Status
            endTime={auctionState?.endTime as number}
            settled={auctionState?.settled as boolean}
            startTime={auction.startTime}
          />
        </div>
      </div>
    </Modal>
  );
}

export default PlaceBidModal;
