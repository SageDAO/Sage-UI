import { useState } from 'react';
import { ethers, Signer } from 'ethers';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Nft_include_NftContractAndOffers } from '@/prisma/types';
import { OfferState, User } from '@prisma/client';
import { usePlaceBidMutation } from '@/store/auctionsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import SageFullLogo from '@/public/branding/sage-full-logo.svg';
import CloseSVG from '@/public/interactive/close.svg';
import { BaseMedia } from '@/components/Media';
import shortenAddress from '@/utilities/shortenAddress';

interface Props extends ModalProps {
  artist: User;
  nft: Nft_include_NftContractAndOffers;
}

//@scss : '@/styles/components/_games-modal.scss'
export default function MakeOfferModal({ isOpen, closeModal, artist, nft }: Props) {
  const [amount, setAmount] = useState(0);
  const [placeBid, { isLoading: isPlaceBidLoading }] = usePlaceBidMutation();
  const { data: signer } = useSigner();

  function handlePlaceBidClick() {
    if (!signer) {
      toast.info('Please Sign In With Ethereum before placing bids.');
      return;
    }
    if (amount < nft.price!) {
      toast.info(`Minimum offer for this piece is ${nft.price}`);
      return;
    }
    // placeBid({ auctionId: auction.id, amount: state.desiredBidValue, signer: signer as Signer });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(+e.target.value);
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className='games-modal'>
        <section className='games-modal__header'>
          <SageFullLogo className='games-modal__sage-logo' />
          <CloseSVG onClick={closeModal} className='games-modal__close-button' />
        </section>
        <section className='games-modal__body'>
          <div className='games-modal__main-img-container'>
            <BaseMedia src={nft.s3Path} />
          </div>
          <div className='games-modal__main-content'>
            <div>
              <h1 className='games-modal__drop-name'>by {artist.username}</h1>
              <h1 className='games-modal__game-name'>{nft.name}</h1>
            </div>
            <p className='games-modal__game-description'>
              {nft.description || 'this artwork has no description provided.'}
            </p>
            <input
              onChange={handleInputChange}
              type='number'
              className='games-modal__bid-input'
              value={amount}
            />
            <button
              disabled={isPlaceBidLoading}
              className='games-modal__place-bid-button'
              onClick={handlePlaceBidClick}
            >
              make offer
            </button>
          </div>
        </section>
        <section className='games-modal__bid-history-section'>
          <table className='games-modal__bid-history-table'>
            <tbody className='games-modal__bid-history-data'>
              {nft.Offers.map(({ signer: offerSigner, state: offerState, price: offerPrice }) => {
                if (offerState != OfferState.ACTIVE) return null;
                return (
                  <tr
                    className='games-modal__bid-history-row'
                    key={offerSigner}
                    data-animate-first={true}
                  >
                    <th data-col='bidder' className='games-modal__bid-history-cell'>
                      {shortenAddress(offerSigner)}
                    </th>
                    <th data-col='amount' className='games-modal__bid-history-cell'>
                      {offerPrice} ASH
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </Modal>
  );
}
