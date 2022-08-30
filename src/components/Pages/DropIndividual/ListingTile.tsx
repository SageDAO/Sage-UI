import { useSigner } from 'wagmi';
import { Nft_include_NftContractAndOffers, User } from '@/prisma/types';
import { BaseMedia } from '@/components/Media/BaseMedia';
import shortenAddress from '@/utilities/shortenAddress';
import { Offer, OfferState } from '@prisma/client';
import useModal from '@/hooks/useModal';
import MakeOfferModal from '@/components/Modals/Games/MakeOfferModal';
import BuyNowModal from '@/components/Modals/Games/BuyNowModal';

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
  const { data: signer } = useSigner();
  const { isOpen, closeModal, openModal } = useModal();
  const sellOffer = findActiveSellOffer(nft.Offers!);

  const handleClick = async () => {
    if (nft.ownerAddress) {
      return; // can't buy an NFT that is already owned
    }
    openModal();
  };

  return (
    <div className='drop-page__grid-item' onClick={handleClick}>
      {!sellOffer && (
        <MakeOfferModal artist={artist} nft={nft} isOpen={isOpen} closeModal={closeModal} />
      )}
      {sellOffer && (
        <BuyNowModal
          artist={artist}
          nft={nft}
          sellOffer={sellOffer}
          isOpen={isOpen}
          closeModal={closeModal}
        />
      )}
      <div className='drop-page__grid-item-header'>
        <h1 className='drop-page__grid-item-header-left'>edition size: {1}</h1>
        <div className='drop-page__grid-item-header-right'></div>
      </div>
      <div className='drop-page__grid-item-img'>
        <BaseMedia src={nft.s3Path} />
        <div className='drop-page__grid-item-focus'>
          {nft.ownerAddress
            ? `owned by ${shortenAddress(nft.ownerAddress)}`
            : sellOffer
            ? `buy now for ${nft.price} ASH`
            : `make an offer`}
        </div>
      </div>
      <div className='drop-page__grid-item-info'>
        <h1 className='drop-page__grid-item-info-drop-name'>by {artist.username}</h1>
        <h1 className='drop-page__grid-item-info-game-name'>{nft.name}</h1>
      </div>
    </div>
  );
}
