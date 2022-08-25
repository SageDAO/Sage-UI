import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Nft_include_NftContractAndOffers, User } from '@/prisma/types';
import { useBuyFromSellOfferMutation } from '@/store/nftsReducer';
import { BaseMedia } from '@/components/Media/BaseMedia';
import shortenAddress from '@/utilities/shortenAddress';
import LoaderSpinner from '@/components/LoaderSpinner';
import { Offer, OfferState } from '@prisma/client';
import useModal from '@/hooks/useModal';
import MakeOfferModal from '@/components/Modals/Games/MakeOfferModal';

interface Props {
  nft: Nft_include_NftContractAndOffers;
  artist: User;
}

function findActiveSellOffer(offers: Offer[]): Offer | null {
  const now = Math.floor(new Date().getTime() / 1000);
  for (var o of offers) {
    if (o.expiresAt > now && o.isSellOffer && o.state == OfferState.ACTIVE) {
      return o;
    }
  }
  return null;
}

export default function ListingTile({ nft, artist }: Props) {
  const [buyFromSellOffer, { isLoading }] = useBuyFromSellOfferMutation();
  const { data: signer } = useSigner();
  const { isOpen, closeModal, openModal: openMakeOfferModal } = useModal();
  const sellOffer = findActiveSellOffer(nft.Offers!);

  const handleClick = async () => {
    if (nft.ownerAddress) {
      return; // can't buy an NFT that is already owned
    }
    if (!signer) {
      toast.info('Please Sign In With Ethereum.');
    } else if (isLoading) {
      toast.info('Please wait for transaction to complete.');
    } else if (sellOffer) {
      await buyFromSellOffer({ sellOffer, signer });
    } else {
      openMakeOfferModal();
    }
  };

  return (
    <div className='drop-page__grid-item' onClick={handleClick}>
      <MakeOfferModal artist={artist} nft={nft} isOpen={isOpen} closeModal={closeModal} />
      <div className='drop-page__grid-item-header'>
        <h1 className='drop-page__grid-item-header-left'>edition size: {1}</h1>
        <div className='drop-page__grid-item-header-right'></div>
      </div>
      <div className='drop-page__grid-item-img'>
        <BaseMedia src={nft.s3Path} />
        <div className='drop-page__grid-item-focus'>
          {isLoading ? (
            <LoaderSpinner />
          ) : nft.ownerAddress ? (
            `owned by ${shortenAddress(nft.ownerAddress)}`
          ) : sellOffer ? (
            `buy now for ${nft.price} ASH`
          ) : (
            `make an offer`
          )}
        </div>
      </div>
      <div className='drop-page__grid-item-info'>
        <h1 className='drop-page__grid-item-info-drop-name'>by {artist.username}</h1>
        <h1 className='drop-page__grid-item-info-game-name'>{nft.name}</h1>
      </div>
    </div>
  );
}
