import {
  useGetClaimedAuctionNftsQuery,
  useGetUnclaimedAuctionNftsQuery,
} from '@/store/auctionsReducer';
import { useGetClaimedPrizesQuery, useGetUnclaimedPrizesQuery } from '@/store/prizesReducer';
import { GamePrize } from '@/prisma/types';
import LoaderDots from '@/components/LoaderDots';
import { BaseMedia } from '@/components/Media';

export default function CollectionPanel() {
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
    return <LoaderDots />;
  }

  return (
    <div className='collection-panel'>
      <div className='collection-panel__grid'>
        {!myNfts.length && 'a little bit empty...'}
        {myNfts &&
          myNfts?.map((item: GamePrize) => {
            if (!item?.s3Path) return;
            return (
              <div key={item.nftId} className='collection-panel__tile'>
                <div className='collection-panel__img-container'>
                  <BaseMedia src={item.s3Path} isVideo={item.isVideo}></BaseMedia>
                </div>
                <div className='collection-panel__tile-header'>
                  {item.dropId} by {item.artistDisplayName || item}
                  <h1 className='collection-panel__tile-name'>it is getting late</h1>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
