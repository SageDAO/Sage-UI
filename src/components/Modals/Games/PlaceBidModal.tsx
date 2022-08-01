import { useEffect, useState } from 'react';
import { Signer } from 'ethers';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Auction_include_Nft } from '@/prisma/types';
import type { User } from '@prisma/client';
import { useGetAuctionStateQuery, usePlaceBidMutation } from '@/store/auctionsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import SageFullLogo from '@/public/branding/sage-full-logo.svg';
import CloseSVG from '@/public/interactive/close.svg';
import { BaseMedia } from '@/components/Media';
import System from '@/components/Icons/System';
import BidHistoryTable from '@/components/Games/BidHistoryTable';

interface Props extends ModalProps {
  auction: Auction_include_Nft;
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

//@scss : '@/styles/components/_games-modal.scss'
function PlaceBidModal({ isOpen, closeModal, auction, artist, dropName }: Props) {
  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
  const [state, setState] = useState<State>(initialState);
  const [placeBid, { isLoading: isPlaceBidLoading }] = usePlaceBidMutation();
  const { data: signer } = useSigner();
  const now = new Date().getTime();
  const isOpenForBids =
    auctionState && auctionState.endTime > now && auction.startTime.getTime() < now;

  function toggleBidHistory() {
    setState((prevState) => {
      return { ...prevState, shouldShowBidHistory: !prevState.shouldShowBidHistory };
    });
  }

  function handlePlaceBidClick() {
    if (signer) {
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
          <SageFullLogo className='games-modal__sage-logo' />
          <CloseSVG onClick={closeModal} className='games-modal__close-button' />
        </section>
        <section className='games-modal__body'>
          <div className='games-modal__main-img-container'>
            <BaseMedia src={auction.Nft.s3Path} />
          </div>
          <div className='games-modal__main-content'>
            <div>
              <h1 className='games-modal__drop-name'>
                {dropName} by {artist.displayName}
              </h1>
              <h1 className='games-modal__game-name'>{auction.Nft.name}</h1>
            </div>
            <p className='games-modal__game-description'>{auction.Nft.description}</p>
            <div className='games-modal__system'>
              <div className='games-modal__system-icon-container'>
                <System type='auctions'></System>
              </div>
              <h1 className='games-modal__system-info'>This is an auction</h1>
            </div>
            <div className='games-modal__bid-info-group'>
              <div>
                <h1 className='games-modal__highest-bid-label'>
                  {auction.winnerAddress
                    ? 'winning bid'
                    : `${isOpenForBids && `current `}highest bid`}
                </h1>
                <h1 className='games-modal__highest-bid-value'>
                  {auctionState?.highestBidNumber} ASH
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

            {isOpenForBids && (
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
