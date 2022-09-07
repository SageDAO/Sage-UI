import { SearchableNftData } from '@/store/nftsReducer';
import { BaseMedia } from '@/components/Media/BaseMedia';
import useSageRoutes from '@/hooks/useSageRoutes';

interface Props {
  nft: SearchableNftData;
  i: number;
}

type ImgAspectRatio = '16/9' | '9/16' | '1/1';

function getRandomizedAspectRatio(i: number): ImgAspectRatio {
  let dataAspect: ImgAspectRatio = '1/1';
  if (i % 3 === 0) {
    if (i !== 6) {
      dataAspect = '9/16';
    }
  }
  if (i % 5 === 0) {
    if (i !== 10) {
      dataAspect = '16/9';
    }
  }
  return dataAspect;
}

export default function SearchResultsTile({ nft, i }: Props) {
  const { pushToDrops, pushToCreators } = useSageRoutes();
  const handleClick = async () => {
    if (nft.dId) {
      pushToDrops(nft.dId);
    } else {
      pushToCreators(nft.artist);
    }
  };
  const dataAspect = getRandomizedAspectRatio(i);
  return (
    <div className='search-page__grid-item' data-aspect={dataAspect} onClick={handleClick}>
      <div className='search-page__grid-item-img'>
        <BaseMedia src={nft.s3Path}></BaseMedia>
      </div>
      <div className='search-page__grid-item-info'>
        <h1 className='search-page__grid-item-info-nft-name'>{nft.name}</h1>
        <h1 className='search-page__grid-item-info-artist-name'>by {nft.artist}</h1>
      </div>
    </div>
  );
}
