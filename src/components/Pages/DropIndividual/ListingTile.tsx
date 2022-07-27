import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Nft_include_NftContractAndOffers, User } from '@/prisma/types';
import { useBuySingleNftMutation } from '@/store/nftsReducer';
import { BaseMedia } from '@/components/Media';
import shortenAddress from '@/utilities/shortenAddress';
import LoaderSpinner from '@/components/LoaderSpinner';
import { Offer, OfferState } from '@prisma/client';

interface Props {
  nft: Nft_include_NftContractAndOffers;
  artist: User;
}

function filterSellOffers(offers: Offer[]): Offer | null {
  const now = Math.floor(new Date().getTime() / 1000);
  for (var o of offers) {
    if (o.expiresAt > now && o.isSellOffer && o.state == OfferState.ACTIVE) {
      return o;
    }
  }
  return null;
}

export default function ListingTile({ nft, artist }: Props) {
  const [buySingleNft, { isLoading }] = useBuySingleNftMutation();
  const { data: signer } = useSigner();
  const sellOffer = filterSellOffers(nft.Offers!);

  const handleBuyClick = async () => {
    if (nft.ownerAddress || !sellOffer) {
      return; // can't buy an NFT that is already owned or doesn't have a sell offer
    }
    if (!signer) {
      toast.info('Please Sign In before placing orders.');
    } else if (isLoading) {
      toast.info('Please wait for transaction to complete.');
    } else {
      await buySingleNft({ sellOffer, signer });
    }
  };

  return (
    <div className='drop-page__grid-item' onClick={handleBuyClick}>
      <div className='drop-page__grid-item-header'>
        <h1 className='drop-page__grid-item-header-left'>edition size: {1}</h1>
        <div className='drop-page__grid-item-header-right'></div>
      </div>
      <div className='drop-page__grid-item-img'>
        <BaseMedia src={nft.s3Path}></BaseMedia>
        <div className='drop-page__grid-item-focus'>
          {isLoading ? (
            <LoaderSpinner />
          ) : nft.ownerAddress ? (
            `owned by ${shortenAddress(nft.ownerAddress)}`
          ) : sellOffer ? (
            `buy now for ${nft.price} ASH`
          ) : (
            `not for sale`
          )}
        </div>
      </div>
      <div className='drop-page__grid-item-info'>
        <h1 className='drop-page__grid-item-info-drop-name'>by {artist.displayName}</h1>
        <h1 className='drop-page__grid-item-info-game-name'>{nft.name}</h1>
      </div>
    </div>
  );
}
