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

interface ComputeGameStatusArgs {
  endTime: number | Date;
  startTime: number | Date;
  settled: boolean;
}
export function computeGameStatus({ startTime, endTime, settled }: ComputeGameStatusArgs): Status {
  let end = +endTime;
  let start = +startTime;
  if (settled) {
    return 'Settled';
  }
  if (end < Date.now()) {
    return 'Done';
  }
  if (start < Date.now()) {
    return 'Live';
  }
  if (start > Date.now()) {
    return 'Upcoming';
  }

  return 'Unknown';
}
