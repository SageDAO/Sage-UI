import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  useGetClaimedAuctionNftsPerUserQuery,
  useGetUnclaimedAuctionNftsPerUserQuery,
} from '@/store/services/auctionsReducer';
import {
  useGetClaimedPrizesByUserQuery,
  useGetUnclaimedPrizesByUserQuery,
} from '@/store/services/prizesReducer';
import { GamePrize } from '@/prisma/types';
import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import Loader from 'react-loader-spinner';

export function MyCollection() {
  const { data: sessionData } = useSession();
  const { data: claimedPrizes, isFetching: isFetchingFromLotteries } =
    useGetClaimedPrizesByUserQuery(sessionData?.address as string);
  const { data: unclaimedPrizes } = useGetUnclaimedPrizesByUserQuery(
    sessionData?.address as string
  );
  const { data: claimedAuctionNfts, isFetching: isFetchingFromAuctions } =
    useGetClaimedAuctionNftsPerUserQuery();
  const { data: unclaimedAuctionNfts } = useGetUnclaimedAuctionNftsPerUserQuery();
  const numUnclaimedItems = (unclaimedAuctionNfts?.length || 0) + (unclaimedPrizes?.length || 0);
  const myNfts = new Array().concat(claimedAuctionNfts, claimedPrizes);
  
  if (isFetchingFromLotteries || isFetchingFromAuctions) {
    return (
      <div className='profile-page'>
        <br />
        <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
      </div>
    );
  }

  return (
    <div className='collection'>
      <div className='collection__header'>
        My Collection
        {numUnclaimedItems > 0 && (
          <div className='collection__claimable'>
            <Link href='/rewards'>
              <div>
                You have {numUnclaimedItems} NFT {numUnclaimedItems > 1 && 's'} to claim. Click here
                to view {numUnclaimedItems > 1 ? 'them' : 'it'}!
              </div>
            </Link>
          </div>
        )}
      </div>
      <div className='collection__grid'>
        {myNfts?.map((item: GamePrize, index: number) => {
          return (
            <div className='collection__tile' key={index}>
              <div className='collection__tile-img'>
                <Image src={item.s3Path} layout='fill' objectFit='cover' />
              </div>
              <div className='collection__tile-details'>
                <div className='collection__tile-artist-pfp'>
                  <Image
                    src={item.artistProfilePicture || DEFAULT_PROFILE_PICTURE}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
                <div className='collection__tile-artist-info'>
                  <div className='collection__tile-nft-name'>{item.nftName}</div>
                  <div className='collection__tile-artist-name'>by {item.artistDisplayName}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
