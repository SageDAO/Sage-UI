import { useGetLotteryQuery, useGetLotteryWinnersQuery } from '@/store/lotteriesReducer';
import { transformTitle } from '@/utilities/strings';
import { Drop, Lottery, Nft, User } from '@prisma/client';

interface UseLotteryArgs {
  lottery: Lottery;
  nfts: Nft[];
  selectedIndex?: number;
}

export default function useLottery({ lottery, nfts, selectedIndex }: UseLotteryArgs) {
  const now = new Date();
  const selectedNft = nfts[selectedIndex || 0];
  const isStarted = new Date(lottery.startTime) < now;
  const isEnded = new Date(lottery.endTime) < now;
  const isLive = isStarted && !isEnded;
  const startTime = lottery.startTime.getTime();
  const endTime = lottery.endTime.getTime();
  const mediaSrc = selectedNft.s3Path;
  const optimizedMediaSrc = selectedNft.s3PathOptimized;
  const hasMaxTicketsPerUser: boolean = lottery.maxTicketsPerUser > 0;
  const selectedNftEditionsCount: number = selectedNft.numberOfEditions;
  const selectedNftName: string = transformTitle(selectedNft.name);
  const selectedNftEditionsText: string = selectedNftEditionsCount > 1 ? 'editions' : 'edition';
  const { data: lotteryWinners } = useGetLotteryWinnersQuery(lottery.id, { skip: !isEnded });

  return {
    isLive,
    isStarted,
    isEnded,
    startTime,
    endTime,
    mediaSrc,
    optimizedMediaSrc,
    selectedNftName,
    selectedNftEditionsText,
    lotteryWinners,
    hasMaxTicketsPerUser,
    selectedNftEditionsCount,
  };
}
