import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Nft_include_NftContract, User } from '@/prisma/types';
import { useBuySingleNftMutation } from '@/store/nftsReducer';
import { BaseMedia } from '@/components/Media';
import shortenAddress from '@/utilities/shortenAddress';
import LoaderSpinner from '@/components/LoaderSpinner';

interface Props {
  nft: Nft_include_NftContract;
  artist: User;
}

export default function ListingTile({ nft, artist }: Props) {
  const [buySingleNft, { isLoading }] = useBuySingleNftMutation();
  const { data: signer } = useSigner();
  const handleBuyClick = async () => {
    if (nft.ownerAddress) {
      return; // can't buy an NFT that is already owned
    }
    if (!signer) {
      toast.info('Please Sign In before placing orders.');
    } else if (isLoading) {
      toast.info('Please wait for transaction to complete.');
    } else {
      await buySingleNft({
        artistContractAddress: nft.NftContract?.contractAddress!,
        nftId: nft.id,
        price: nft.price!,
        signer,
      });
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
          ) : (
            `buy now for ${nft.price} ASH`
          )}
        </div>
      </div>
      <div className='drop-page__grid-item-info'>
        <h1 className='drop-page__grid-item-info-drop-name'>
          by {artist.displayName}
        </h1>
        <h1 className='drop-page__grid-item-info-game-name'>{nft.name}</h1>
      </div>
    </div>
  );
}
