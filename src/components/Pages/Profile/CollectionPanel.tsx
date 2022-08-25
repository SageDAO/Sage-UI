import { useGetClaimedAuctionNftsQuery } from '@/store/auctionsReducer';
import { useGetClaimedPrizesQuery } from '@/store/prizesReducer';
import { CollectedListingNft, GamePrize } from '@/prisma/types';
import LoaderDots from '@/components/LoaderDots';
import { BaseMedia } from '@/components/Media/BaseMedia';
import { useSession } from 'next-auth/react';
import { useGetListingNftsByOwnerQuery } from '@/store/nftsReducer';
import { animated, Spring } from 'react-spring';

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
      <Spring to={{ translateX: 0 }} from={{ translateX: -100 }}>
        {(styles) => {
          return (
            <animated.h1 style={styles} className='profile-page__tabs-panel-header'>
              collection
              <span className='profile-page__tabs-panel-subheader'>
                your collection of artworks on sage
              </span>
            </animated.h1>
          );
        }}
      </Spring>

      <Spring to={{ translateX: 0 }} from={{ translateX: -100 }}>
        {(styles) => {
          return (
            <animated.div style={styles} className='collection-panel'>
              <div className='collection-panel__grid'>
                {!myNfts.length && 'a little bit empty...'}
                {myNfts &&
                  myNfts?.map((nft: GamePrize | CollectedListingNft) => {
                    if (!nft?.s3Path) return null;
                    return (
                      <div key={nft.nftId} className='collection-panel__tile'>
                        <div className='collection-panel__img-container'>
                          <BaseMedia src={nft.s3Path} isZoomable={true}></BaseMedia>
                        </div>
                        <div className='collection-panel__tile-header'>
                          by {nft.artistUsername}
                          <h1 className='collection-panel__tile-name'>{nft.nftName}</h1>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </animated.div>
          );
        }}
      </Spring>
    </>
  );
}
