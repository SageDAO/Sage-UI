import { toast } from 'react-toastify';
import { bid, BidArgs, useGetAuctionStateQuery } from '@/store/services/auctionsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import { Auction_include_Nft } from '@/prisma/types';
import type { User } from '@prisma/client';
import GamesModalHeader from './GamesModalHeader';
import Status from '@/components/Status';
import { useState } from 'react';
import { useAccount, useBalance, useSigner } from 'wagmi';
import PlaceBidButton from '@/components/Games/PlaceBidButton';
import { utils, Signer, BigNumber } from 'ethers';

interface Props extends ModalProps {
  auction: Auction_include_Nft;
  artist: User;
}

//@scss : '@/styles/components/_games-modal.scss'
function PlaceBidModal({ isOpen, closeModal, auction, artist }: Props) {
  const [desiredBidValue, setDesiredBidValue] = useState<number>(+auction.minimumPrice! || 0);
  const { data: accountData } = useAccount();
  const { data: balance } = useBalance({ addressOrName: accountData?.address });
  const { data: signer } = useSigner();

  function handlePlaceBidClick(e: React.MouseEvent<HTMLButtonElement>) {
    bid({ auctionId: auction.id, amount: desiredBidValue, signer: signer as Signer });
  }

  function handleMaxButtonClick() {
    setDesiredBidValue(+auction.buyNowPrice! || +balance?.formatted! || 1000);
  }

  function handleMinButtonClick() {
    setDesiredBidValue(+auction.minimumPrice!);
  }

  function handleBidInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDesiredBidValue(e.currentTarget.valueAsNumber);
  }

  let pending = false;

  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
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
              {auctionState && auctionState.highestBidString}
            </div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Bid extension</div>
            <div className='games-modal__rules-value'>time</div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Bid increment</div>
            <div className='games-modal__rules-value'>value</div>
          </div>
          <div className='games-modal__rules-divider-container'>
            <div className='games-modal__rules-divider-rectangle'></div>
          </div>
          <div className='games-modal__rules-item'>
            <div className='games-modal__rules-label'>Minimum Bid</div>
            <div className='games-modal__rules-value'>value</div>
          </div>
        </div>
        <div className='games-modal__heading'>
          <h1 className='games-modal__heading-label'>Amount</h1>
          <div className='games-modal__heading-value games-modal__heading-value--blue'>
            {auction.buyNowPrice || auction.minimumPrice}
          </div>
        </div>
        <div className='games-modal__bid-section'>
          <div className='games-modal__bid-controls'>
            <input
              type='number'
              className='games-modal__bid-input'
              value={desiredBidValue}
              onChange={handleBidInputChange}
              min={+auction.minimumPrice! || 0}
              max={+auction.buyNowPrice! || undefined}
              disabled={pending}
            ></input>
            <span className='games-modal__bid-unit'>ASH</span>
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
            <PlaceBidButton pending={pending} onClick={handlePlaceBidClick} />
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
