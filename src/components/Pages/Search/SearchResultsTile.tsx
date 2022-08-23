import { SearchableNftData } from '@/store/nftsReducer';
import { BaseMedia } from '@/components/Media/BaseMedia';
import { useRouter } from 'next/router';

interface Props {
  nft: SearchableNftData;
}

export default function SearchResultsTile({ nft }: Props) {

  const router = useRouter();
  
  const handleClick = async () => {
    if (nft.dId) {
      router.push(`/drops/${nft.dId}`);
    } else {
      router.push(`/artists/${nft.artist}`);
    }
  };

  return (
    <div className='drop-page__grid-item' onClick={handleClick}>
      <div className='drop-page__grid-item-img'>
        <BaseMedia src={nft.s3Path}></BaseMedia>
      </div>
      <div className='drop-page__grid-item-info'>
        <h1 className='drop-page__grid-item-info-drop-name'>by {nft.artist}</h1>
        <h1 className='drop-page__grid-item-info-game-name'>{nft.name}</h1>
      </div>
    </div>
  );
}
