import { useEffect, useState } from 'react';
import { ethers, Signer } from 'ethers';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Nft_include_NftContractAndOffers } from '@/prisma/types';
import { Offer, OfferState, User } from '@prisma/client';
import { usePlaceBidMutation } from '@/store/auctionsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import SageFullLogo from '@/public/branding/sage-full-logo.svg';
import CloseSVG from '@/public/interactive/close.svg';
import { BaseMedia } from '@/components/Media';
import shortenAddress from '@/utilities/shortenAddress';
import { OfferRequest, useCreateBuyOfferMutation } from '@/store/nftsReducer';
import LoaderSpinner from '@/components/LoaderSpinner';

interface Props extends ModalProps {
  artist: User;
  nft: Nft_include_NftContractAndOffers;
}

//@scss : '@/styles/components/_games-modal.scss'
export default function MakeOfferModal({ isOpen, closeModal, artist, nft }: Props) {
  const [amount, setAmount] = useState(nft.price!);
  const [createBuyOffer, { isLoading: isCreatingBuyOffer }] = useCreateBuyOfferMutation();
  const { data: signer } = useSigner();

  async function handlePlaceBidClick() {
    if (!signer) {
      toast.info('Please Sign In With Ethereum before placing bids.');
      return;
    }
    if (amount < nft.price!) {
      toast.info(`Minimum offer for this piece is ${nft.price}`);
      return;
    }
    await createBuyOffer({
      nftId: nft.id,
      amount,
      signer: signer as Signer,
      nftContractAddress: nft.NftContract?.contractAddress,
    } as OfferRequest);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(+e.target.value);
  }

  function sortByAmountDesc(offers: Offer[]) {
    return offers.sort((a, b) => {
      return b.price - a.price;
    })
  }

  useEffect(() => {
    // find highest offer
    var highestOffer = nft.price!;
    for (const o of nft.Offers) {
      if (o.state == OfferState.ACTIVE && o.price > highestOffer) {
        highestOffer = o.price;
      }
    }
    setAmount(highestOffer);
  }, [nft]);

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
              disabled={isCreatingBuyOffer}
              className='games-modal__place-bid-button'
              onClick={handlePlaceBidClick}
            >
              {isCreatingBuyOffer ? <LoaderSpinner /> : 'make offer'}
            </button>
          </div>
        </section>
        <section className='games-modal__bid-history-section'>
          <table className='games-modal__bid-history-table'>
            <tbody className='games-modal__bid-history-data'>
              {nft.Offers.length > 0 && (
                <span style={{ fontWeight: 'bolder' }}>active open offers</span>
              )}
              {sortByAmountDesc([...nft.Offers]).map(
                ({ signer: offerSigner, state: offerState, price: offerPrice }, i: number) => {
                  if (offerState != OfferState.ACTIVE) return null;
                  return (
                    <tr className='games-modal__bid-history-row' key={i} data-animate-first={true}>
                      <th data-col='bidder' className='games-modal__bid-history-cell'>
                        {shortenAddress(offerSigner)}
                      </th>
                      <th data-col='amount' className='games-modal__bid-history-cell'>
                        {offerPrice} ASH
                      </th>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>{' '}
        </section>
      </div>
    </Modal>
  );
}
