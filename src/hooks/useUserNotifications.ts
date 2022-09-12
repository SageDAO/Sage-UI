import { useGetPrizesByUserQuery } from '@/store/prizesReducer';
import {
  useGetClaimedAuctionNftsQuery,
  useGetUnclaimedAuctionNftsQuery,
} from '@/store/auctionsReducer';
import { GamePrize } from '@/prisma/types';

function getUnclaimedNfts(prizeNfts: GamePrize[]) {
  return prizeNfts.filter((gamePrize) => {
    return gamePrize?.claimedAt == null;
  });
}

export default function useUserNotifications() {
  const { data: lotteryNfts, isFetching: fetchingLotteryNfts } = useGetPrizesByUserQuery();
  const { data: claimedAuctionNfts, isFetching: fetchingClaimedAuctionNfts } =
    useGetClaimedAuctionNftsQuery();
  const { data: unclaimedAuctionNfts, isFetching: fetchingUnclaimedAuctionNfts } =
    useGetUnclaimedAuctionNftsQuery();

  const isLoading: boolean =
    fetchingLotteryNfts || fetchingClaimedAuctionNfts || fetchingUnclaimedAuctionNfts;

  const prizeNfts: GamePrize[] = new Array().concat(
    lotteryNfts,
    claimedAuctionNfts,
    unclaimedAuctionNfts
  );

  const unclaimedNfts = getUnclaimedNfts(prizeNfts);
  const notificationCount: number = unclaimedNfts.length;
  const hasNotifications: boolean = notificationCount > 0;

  return { prizeNfts, notificationCount, hasNotifications, isLoading };
}
