import { parameters } from '../constants/config';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { PrismaClient } from '@prisma/client';

console.log('functions()');
const { LOTTERY_ADDRESS, AUCTION_ADDRESS } = parameters;
// const LOTTERY_ADDRESS = '';
// const AUCTION_ADDRESS = '';

export async function getHomePageData(prisma: PrismaClient) {
  let drops: Drop_include_GamesAndArtist[] = await prisma.drop.findMany({
    orderBy: {
      approvedAt: 'desc',
    },
    include: {
      Artist: true,
      Lotteries: true,
      Auctions: true,
    },
    where: {
      approvedAt: { not: null },
      Lotteries: { every: { contractAddress: { not: null, equals: LOTTERY_ADDRESS } } },
      Auctions: { every: { contractAddress: { not: null, equals: AUCTION_ADDRESS } } },
    },
    take: 4,
  });

  const featuredDrop = drops[0];
  const upcomingDrops = drops;

  return { featuredDrop, upcomingDrops, drops };
}

export async function getDropsPageData(prisma: PrismaClient) {
  const drops = await prisma.drop.findMany({
    orderBy: { approvedAt: 'desc' },
    include: {
      Lotteries: true,
      Auctions: true,
      Artist: true,
    },
    where: {
      Lotteries: { every: { contractAddress: { not: null, equals: LOTTERY_ADDRESS } } },
      Auctions: { every: { contractAddress: { not: null, equals: AUCTION_ADDRESS } } },
    },
    take: 3,
  });

  return drops;
}
