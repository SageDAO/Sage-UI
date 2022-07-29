import {
  useGetClaimedAuctionNftsQuery,
  useGetUnclaimedAuctionNftsQuery,
} from '@/store/auctionsReducer';
import { useGetClaimedPrizesQuery, useGetUnclaimedPrizesQuery } from '@/store/prizesReducer';
import { CollectedListingNft, GamePrize } from '@/prisma/types';
import LoaderDots from '@/components/LoaderDots';
import { BaseMedia } from '@/components/Media';
import { useSession } from 'next-auth/react';
import { useGetListingNftsByOwnerQuery } from '@/store/nftsReducer';

export default function CollectionPanel() {
  const { data: sessionData } = useSession();
  const { data: claimedPrizes, isFetching: fetchingClaimedPrizes } = useGetClaimedPrizesQuery(
    undefined,
    { skip: !sessionData }
  );
  const { data: unclaimedPrizes, isFetching: fetchingUnclaimedPrizes } = useGetUnclaimedPrizesQuery(
    undefined,
    { skip: !sessionData }
  );
  const { data: claimedAuctionNfts, isFetching: fetchingClaimedAuctionNfts } =
    useGetClaimedAuctionNftsQuery(undefined, { skip: !sessionData });
  const { data: unclaimedAuctionNfts, isFetching: fetchingUnclaimedAuctionNfts } =
    useGetUnclaimedAuctionNftsQuery(undefined, { skip: !sessionData });
  const { data: listingNfts, isFetching: fetchingListingNfts } = useGetListingNftsByOwnerQuery(
    undefined,
    { skip: !sessionData }
  );

  if (
    fetchingClaimedPrizes ||
    fetchingUnclaimedPrizes ||
    fetchingClaimedAuctionNfts ||
    fetchingUnclaimedAuctionNfts ||
    fetchingListingNfts
  ) {
    return <LoaderDots />;
  }

  const myNfts = new Array().concat(
    unclaimedAuctionNfts,
    unclaimedPrizes,
    claimedAuctionNfts,
    claimedPrizes,
    listingNfts
  );

  return (
    <div className='collection-panel'>
      <div className='collection-panel__grid'>
        {!myNfts.length && 'a little bit empty...'}
        {myNfts &&
          myNfts?.map((nft: GamePrize | CollectedListingNft) => {
            if (!nft?.s3Path) return;
            return (
              <div key={nft.nftId} className='collection-panel__tile'>
                <div className='collection-panel__img-container'>
                  <BaseMedia src={nft.s3Path} isVideo={nft.isVideo} isZoomable={true}></BaseMedia>
                </div>
                <div className='collection-panel__tile-header'>
                  by {nft.artistDisplayName || nft.artistUsername}
                  <h1 className='collection-panel__tile-name'>{nft.nftName}</h1>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
