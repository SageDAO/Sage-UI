import { Lottery as LotteryType, Auction as AuctionType } from '@prisma/client';
import { Drop_include_GamesAndArtist } from '@/prisma/types';

type Game = Partial<LotteryType> | Partial<AuctionType>;

type Status = 'Done' | 'Live' | 'Unknown' | 'Upcoming' | 'Settled';

export function computeDropStatus({ Lotteries, Auctions }: Drop_include_GamesAndArtist) {
  let games: Game[];
  let startTime: number;
  let endTime: number;
  let status: Status = 'Unknown';
  games = [...Lotteries!, ...Auctions!];
  games.sort((a: any, b: any) => +a.startTime - +b.startTime);
  startTime = +games[0].startTime!;
  games.sort((a: any, b: any) => +b.endTime + a.endTime);
  endTime = +games[0].endTime!;
  //TODO: status countdown
  if (new Date(startTime).getHours() - Date.now() < 92) {
    status = 'Upcoming';
  }
  if (startTime < Date.now()) {
    status = 'Live';
    if (endTime < Date.now()) {
      status = 'Done';
      //TODO: check if user has a claimable in this drop
    }
  }

  //TODO: this function should return react nodes with unique styling
  return { startTime, endTime, status };
}

export interface ComputeAuctionStatusArgs {
  endTime: number | Date;
  startTime: number | Date;
  settled: boolean;
}
export function computeAuctionStatus({
  startTime,
  endTime,
  settled,
}: ComputeAuctionStatusArgs): Status {
  let end = +endTime;
  let start = +startTime;
  if (start > Date.now()) {
    return 'Upcoming';
  }
  if (settled) {
    return 'Settled';
  }
  if (end < Date.now()) {
    return 'Done';
  }

  if (start < Date.now()) {
    return 'Live';
  }
  return 'Unknown';
}

export interface ComputeLotteryStatusArgs {
  endTime: number | Date;
  startTime: number | Date;
}

type LotteryStatus = 'upcoming' | 'live' | 'drawn' | 'unknown';

export function computeLotteryStatus({
  startTime,
  endTime,
}: ComputeLotteryStatusArgs): LotteryStatus {
  let lotteryStatus: LotteryStatus = 'unknown';

  if (startTime > Date.now()) {
    lotteryStatus = 'upcoming';
  }

  if (startTime < Date.now() && endTime > Date.now()) {
    lotteryStatus = 'live';
  }

  if (endTime < Date.now()) {
    lotteryStatus = 'drawn';
  }

  return lotteryStatus;
}