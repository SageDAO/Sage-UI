import { useGetClaimedAuctionNftsQuery } from '@/store/auctionsReducer';
import { useGetClaimedPrizesQuery } from '@/store/prizesReducer';
import { CollectedListingNft, GamePrize } from '@/prisma/types';
import LoaderDots from '@/components/LoaderDots';
import { BaseMedia } from '@/components/Media/BaseMedia';
import { useSession } from 'next-auth/react';
import { useGetListingNftsByOwnerQuery } from '@/store/nftsReducer';

export default function CollectionPanel() {
  const { data: sessionData } = useSession();
  const { data: claimedPrizes, isFetching: fetchingClaimedPrizes } = useGetClaimedPrizesQuery(
    undefined,
    { skip: !sessionData }
  );
  const { data: claimedAuctionNfts, isFetching: fetchingClaimedAuctionNfts } =
    useGetClaimedAuctionNftsQuery(undefined, { skip: !sessionData });
  const { data: listingNfts, isFetching: fetchingListingNfts } = useGetListingNftsByOwnerQuery(
    undefined,
    { skip: !sessionData }
  );

  if (fetchingClaimedPrizes || fetchingClaimedAuctionNfts || fetchingListingNfts) {
    return <LoaderDots />;
  }

  const myNfts = new Array().concat(claimedAuctionNfts, claimedPrizes, listingNfts);

  return (
    <>
      <h1 className='profile-page__tabs-panel-header'>
        collection
        <span className='profile-page__tabs-panel-subheader'>
          your collection of artworks on SAGE
        </span>
      </h1>
      <div className='collection-panel'>
        <div className='collection-panel__grid'>
          {!myNfts.length && 'a little bit empty...'}
          {myNfts &&
            myNfts?.map((nft: GamePrize | CollectedListingNft) => {
              if (!nft?.s3PathOptimized) return null;
              // if ()
              return (
                <div key={nft.nftId} className='collection-panel__tile'>
                  <div className='collection-panel__img-container'>
                    <BaseMedia src={nft.s3PathOptimized} isZoomable={true}></BaseMedia>
                  </div>
                  <div className='collection-panel__tile-header'>
                    by {nft.artistUsername}
                    <h1 className='collection-panel__tile-name'>{nft.nftName}</h1>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
