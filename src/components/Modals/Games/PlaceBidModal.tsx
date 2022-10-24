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
import { BaseMedia } from '@/components/Media/BaseMedia';
import System from '@/components/Icons/System';
import BidHistoryTable from '@/components/Games/BidHistoryTable';
import Countdown from '@/components/Countdown';
import ArrowRightSVG from '@/public/interactive/arrow-right.svg';
import { transformTitle } from '@/utilities/strings';
import useAuction from '@/hooks/useAuction';
import { useSession } from 'next-auth/react';
import shortenAddress from '@/utilities/shortenAddress';
import ClaimPrizeButton from '@/components/Pages/Profile/ClaimPrizeButton';

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

export function computeAuctionStatus(auction: Auction_include_Nft, auctionState: AuctionState) {
  const now = new Date().getTime();
  const isOpenForBids =
    auctionState && auctionState.endTime > now && auction.startTime.getTime() < now;
  const isStarted = auction.startTime.getTime() < now;

  const isEnded = auctionState
    ? Boolean(auctionState.endTime !== undefined) && Boolean(auctionState.endTime < now)
    : false;
  return { isOpenForBids, isStarted, isEnded };
}

//@scss : '@/styles/components/_games-modal.scss'
function PlaceBidModal({ isOpen, closeModal, auction, artist, dropName }: Props) {
  const [state, setState] = useState<State>(initialState);
  const [placeBid, { isLoading: isPlaceBidLoading }] = usePlaceBidMutation();
  const { data: signer } = useSigner();
  const { data: sessionData } = useSession();
  const walletAddress = sessionData?.address;

  const {
    nftName,
    auctionState,
    nftPath,
    artistName,
    isStarted,
    isRunning,
    isEnded,
    isOpenForBids,
    editionSize,
    startTime,
    endTime,
    bidLabel,
    highestBidder,
    highestBid,
    nextMinBid,
    buttonText,
    description,
    prize,
    gameInfo,
  } = useAuction({ auction, artist, walletAddress: walletAddress as string });

  function toggleBidHistory() {
    setState((prevState) => {
      return { ...prevState, shouldShowBidHistory: !prevState.shouldShowBidHistory };
    });
  }

  function handlePlaceBidClick() {
    if (!signer) {
      toast.info('Please sign in with a wallet.');
      return;
    }
    if (state.desiredBidValue < state.minBid) {
      toast.info(`Current minimum bid is ${state.minBid}`);
      return;
    }
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
    if (nextMinBid != 0) {
      const nextMinBid = roundNextMinBid(auctionState.nextMinBid);
      setState((prevState) => {
        return {
          ...prevState,
          desiredBidValue: nextMinBid,
          minBid: nextMinBid,
        };
      });
    }
  }

  function handleStartingBid() {
    if (!auction.minimumPrice) return;
    if (nextMinBid) return;
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

  // const statusLabel = auction.winnerAddress
  //   ? 'winning bid'
  //   : computeAuctionStatus(auction, auctionState)
  //   ? 'current highest bid'
  //   : 'highest bid';

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className='games-modal'>
        <section className='games-modal__header'>
          <SageFullLogo className='games-modal__sage-logo' />
          <button className='games-modal__close-button'>
            <CloseSVG onClick={closeModal} className='games-modal__close-button-svg' />
          </button>
        </section>
        <div className='games-modal__body'>
          <section className='games-modal__main'>
            <div className='games-modal__main-img-container'>
              <BaseMedia src={nftPath} isZoomable={true} />
              {isStarted && (
                <>
                  <Countdown endTime={startTime} className='games-modal__countdown'></Countdown>

                  <Countdown endTime={endTime} className='games-modal__countdown'></Countdown>
                </>
              )}
              {/* {!isOpenForBids && (
              )}
              {isOpenForBids && isRunning && (
              )} */}
            </div>
            <div className='games-modal__main-content'>
              <div>
                <p className='games-modal__drop-name'>
                  {transformTitle(dropName)} by {artistName}
                </p>
                <p className='games-modal__game-name'>{nftName}</p>
              </div>
              <p className='games-modal__game-description'>{description}</p>
              <div className='games-modal__system'>
                <div className='games-modal__system-icon-container'>
                  <System type='auction'></System>
                </div>
                <p className='games-modal__system-info'>{gameInfo}</p>
              </div>
              {isEnded && walletAddress && walletAddress == highestBidder && (
                <div style={{ marginBottom: '25px' }}>
                  <div className='games-modal__bid-info-group'>
                    <div className='games-modal__highest-bid'>
                      <p className='games-modal__highest-bid-label'>WINNER</p>
                      <p className='games-modal__highest-bid-value'>
                        {shortenAddress(highestBidder)}
                      </p>
                      &nbsp; &nbsp;
                      <ClaimPrizeButton gamePrize={prize} />
                    </div>
                  </div>
                </div>
              )}
              {isStarted && (
                <div>
                  <div className='games-modal__bid-info-group'>
                    <div className='games-modal__highest-bid'>
                      <p className='games-modal__highest-bid-label'>Highest Bid</p>
                      <p className='games-modal__highest-bid-value'>{highestBid} ASH</p>
                    </div>
                    <button
                      onClick={toggleBidHistory}
                      className='games-modal__see-bid-history-button'
                    >
                      <ArrowRightSVG
                        data-is-open={state.shouldShowBidHistory}
                        className='games-modal__see-bid-history-icon'
                      ></ArrowRightSVG>
                      Bid History
                    </button>
                  </div>
                </div>
              )}
              {!isStarted && !isEnded && (
                <div className='games-modal__upcoming-section'>
                  <p className='games-modal__countdown-label'>Starts in</p>
                  <Countdown
                    endTime={auction.startTime}
                    className='games-modal__countdown'
                  ></Countdown>
                </div>
              )}
              {isOpenForBids && (
                <>
                  <input
                    onChange={handleBidInputChange}
                    type='number'
                    className='games-modal__bid-input'
                    min={nextMinBid}
                    value={state.desiredBidValue}
                  />
                  <button
                    disabled={isPlaceBidLoading}
                    className='games-modal__place-bid-button'
                    onClick={handlePlaceBidClick}
                  >
                    {buttonText}
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
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

function roundNextMinBid(val: number): number {
  return Math.ceil(val * 100) / 100;
}

export default PlaceBidModal;
