import { useEffect, useState } from 'react';
import { Signer } from 'ethers';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Auction_include_Nft } from '@/prisma/types';
import type { User } from '@prisma/client';
import { AuctionState, usePlaceBidMutation } from '@/store/auctionsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import SageFullLogo from '@/public/branding/sage-full-logo.svg';
import CloseSVG from '@/public/interactive/close.svg';
import { BaseMedia } from '@/components/Media';
import System from '@/components/Icons/System';
import BidHistoryTable from '@/components/Games/BidHistoryTable';
import Countdown from '@/components/Countdown';

interface Props extends ModalProps {
  auction: Auction_include_Nft;
  auctionState: AuctionState;
  artist: User;
  dropName: string;
}

type DesiredBidValue = number;

interface State {
  desiredBidValue: DesiredBidValue;
  minBid: DesiredBidValue;
  shouldShowBidHistory: boolean;
}

const initialState: State = {
  desiredBidValue: 0,
  minBid: 0,
  shouldShowBidHistory: false,
};

export function isOpenForBids(auction: Auction_include_Nft, auctionState: AuctionState): boolean {
  const now = new Date().getTime();
  return auctionState && auctionState.endTime > now && auction.startTime.getTime() < now;
}

//@scss : '@/styles/components/_games-modal.scss'
function PlaceBidModal({ isOpen, closeModal, auction, auctionState, artist, dropName }: Props) {
  const [state, setState] = useState<State>(initialState);
  const [placeBid, { isLoading: isPlaceBidLoading }] = usePlaceBidMutation();
  const { data: signer } = useSigner();

  function toggleBidHistory() {
    setState((prevState) => {
      return { ...prevState, shouldShowBidHistory: !prevState.shouldShowBidHistory };
    });
  }

  function handlePlaceBidClick() {
    if (signer) {
      if (state.desiredBidValue < state.minBid) {
        toast.info(`Current minimum bid is ${state.minBid}`);
        return;
      }
      placeBid({ auctionId: auction.id, amount: state.desiredBidValue, signer: signer as Signer });
    } else {
      toast.info('Please Sign In With Ethereum before placing bids.');
    }
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
    if (auctionState.nextMinBid != 0) {
      setState((prevState) => {
        return {
          ...prevState,
          desiredBidValue: auctionState.nextMinBid,
          minBid: auctionState.nextMinBid,
        };
      });
    }
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

  const statusLabel = auction.winnerAddress
    ? 'winning bid'
    : isOpenForBids(auction, auctionState)
    ? 'current highest bid'
    : 'highest bid';

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className='games-modal'>
        <section className='games-modal__header'>
          <SageFullLogo className='games-modal__sage-logo' />
          <CloseSVG onClick={closeModal} className='games-modal__close-button' />
        </section>
        <section className='games-modal__body'>
          <div className='games-modal__main-img-container'>
            <BaseMedia src={auction.Nft.s3Path} />
            {isOpenForBids(auction, auctionState) && (
              <Countdown
                endTime={auctionState?.endTime}
                className='games-modal__countdown'
              ></Countdown>
            )}
          </div>
          <div className='games-modal__main-content'>
            <div>
              <h1 className='games-modal__drop-name'>
                {dropName} by {artist.username}
              </h1>
              <h1 className='games-modal__game-name'>{auction.Nft.name}</h1>
            </div>
            <p className='games-modal__game-description'>
              {auction.Nft.description || 'this artwork has no description provided.'}
            </p>
            <div className='games-modal__system'>
              <div className='games-modal__system-icon-container'>
                <System type='auctions'></System>
              </div>
              <h1 className='games-modal__system-info'>This is an auction</h1>
            </div>
            <div className='games-modal__bid-info-group'>
              <div>
                <h1 className='games-modal__highest-bid-label'>{statusLabel}</h1>
                <h1 className='games-modal__highest-bid-value'>
                  {auctionState?.highestBidNumber == 0 ? 'no bids yet' : `${auctionState?.highestBidNumber} ASH`}
                </h1>
              </div>
              <div onClick={toggleBidHistory} className='games-modal__see-more-bids'>
                <div
                  data-active={state.shouldShowBidHistory}
                  className='games-modal__see-more-bids-icon'
                >
                  <BaseMedia src={'/icons/expandable.svg'}></BaseMedia>
                </div>
                bid history
              </div>
            </div>

            {isOpenForBids(auction, auctionState) && (
              <>
                <input
                  onChange={handleBidInputChange}
                  type='number'
                  className='games-modal__bid-input'
                  min={auctionState?.nextMinBid}
                  value={state.desiredBidValue}
                />
                <button
                  disabled={isPlaceBidLoading}
                  className='games-modal__place-bid-button'
                  onClick={handlePlaceBidClick}
                >
                  place bid
                </button>
              </>
            )}
          </div>
        </section>
        <section className='games-modal__bid-history-section'>
          <BidHistoryTable
            isActive={state.shouldShowBidHistory}
            auctionId={auction.id}
          ></BidHistoryTable>
        </section>
      </div>
    </Modal>
  );
}

export default PlaceBidModal;
