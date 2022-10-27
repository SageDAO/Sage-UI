import { useGetWinnersQuery } from '@/store/lotteriesReducer';
import { transformTitle } from '@/utilities/strings';
import { Lottery, Nft } from '@prisma/client';

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

  const selectedNftS3Path: string = selectedNft.s3Path;
  let duration = Number(lottery.endTime) - Number(lottery.startTime);
  duration = duration / 1000;
  duration = duration / 60 / 60;
  const { data: lotteryWinners } = useGetWinnersQuery(lottery.id, { skip: !isEnded });
  const durationDisplay = `${duration.toFixed(2)} hour${duration > 1 ? 's' : ''}`;
  const pixelGameInfo =
    "Users can buy tickets for this drop using only Pixel points, which are a SAGE reward for those holding the ASH token in their wallets. Once the entry period is closed, the drawing takes place and the winners, who will be able to mint this collectible, are selected using SAGE's integration with Chainlink.";
  const ashOnlyGameInfo = `Users can enter a live drawing for ${durationDisplay}. At entry, users will be asked to pay the sales price. Once the entry period is closed, the drawing takes place and SAGE selects the game winner through our RNG integration with Chainlink. Users that don't win will receive their refund automatically when gas is at 10 GWEI or below.`;
  const gameInfo = lottery.costPerTicketPoints ? pixelGameInfo : ashOnlyGameInfo;
  const requiresASH: boolean = !!lottery.costPerTicketTokens;
  const requiresPoints: boolean = !!lottery.costPerTicketPoints;

  return {
    isLive,
    isStarted,
    isEnded,
    startTime,
    selectedNftS3Path,
    endTime,
    mediaSrc,
    optimizedMediaSrc,
    selectedNftName,
    selectedNftEditionsText,
    lotteryWinners,
    costASH: lottery.costPerTicketTokens,
    hasMaxTicketsPerUser,
    selectedNftEditionsCount,
    duration,
    durationDisplay,
    gameInfo,
    requiresASH,
    requiresPoints,
  };
}
