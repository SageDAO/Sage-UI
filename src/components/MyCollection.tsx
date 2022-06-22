import {
  useGetClaimedAuctionNftsQuery,
  useGetUnclaimedAuctionNftsQuery,
} from '@/store/services/auctionsReducer';
import {
  useGetClaimedPrizesQuery,
  useGetUnclaimedPrizesQuery,
} from '@/store/services/prizesReducer';
import { GamePrize } from '@/prisma/types';
import Loader from 'react-loader-spinner';
import CollectionTile from './Tiles/CollectionTile';

export function MyCollection() {
  const { data: claimedPrizes, isFetching: fetchingClaimedPrizes } = useGetClaimedPrizesQuery();
  const { data: unclaimedPrizes, isFetching: fetchingUnclaimedPrizes } =
    useGetUnclaimedPrizesQuery();
  const { data: claimedAuctionNfts, isFetching: fetchingClaimedAuctionNfts } =
    useGetClaimedAuctionNftsQuery();
  const { data: unclaimedAuctionNfts, isFetching: fetchingUnclaimedAuctionNfts } =
    useGetUnclaimedAuctionNftsQuery();
  const myNfts = new Array().concat(
    unclaimedAuctionNfts,
    unclaimedPrizes,
    claimedAuctionNfts,
    claimedPrizes
  );

  if (
    fetchingClaimedPrizes ||
    fetchingUnclaimedPrizes ||
    fetchingClaimedAuctionNfts ||
    fetchingUnclaimedAuctionNfts
  ) {
    return (
      <div className='profile-page'>
        <br />
        <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
      </div>
    );
  }

  return (
    <div className='collection'>
      <div className='collection__header'>My Collection</div>
      {myNfts?.length == 0 && (
        <div style={{ marginTop: '50px', marginLeft: '50px', color: '#6f676e' }}>
          Nothing to showcase here (yet)!
        </div>
      )}
      <div className='collection__grid'>
        {myNfts?.map((item: GamePrize) => {
          return <CollectionTile item={item} key={item.nftId} />;
        })}
      </div>
    </div>
  );
}
