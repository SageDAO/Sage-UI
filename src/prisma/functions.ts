import { parameters } from '../constants/config';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { PrismaClient, Prisma, Role } from '@prisma/client';

const FilterDropApprovedOnly: Prisma.DropWhereInput = {
  approvedAt: { not: null },
};

const FilterDropContractValidation: Prisma.DropWhereInput = {
  Lotteries: { every: { contractAddress: { not: null, equals: parameters.LOTTERY_ADDRESS } } },
  Auctions: { every: { contractAddress: { not: null, equals: parameters.AUCTION_ADDRESS } } },
};

const FilterUserIsArtist: Prisma.UserWhereInput = {
  role: Role.ARTIST,
};

export async function getHomePageData(prisma: PrismaClient) {
  let drops: Drop_include_GamesAndArtist[] = await prisma.drop.findMany({
    orderBy: {
      approvedAt: 'desc',
    },
    include: {
      NftContract: { include: { Artist: true } },
      Lotteries: true,
      Auctions: true,
    },
    where: {
      ...FilterDropContractValidation,
      ...FilterDropApprovedOnly,
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
      NftContract: { include: { Artist: true } },
      Lotteries: { include: { Nfts: true } },
      Auctions: { include: { Nft: true } },
    },
    where: {
      ...FilterDropContractValidation,
      ...FilterDropApprovedOnly,
    },
    take: 3,
  });

  return drops;
}

export async function getIndividualDropsPagePaths(prisma: PrismaClient) {
  let drops = await prisma.drop.findMany({
    where: {
      ...FilterDropApprovedOnly,
      ...FilterDropContractValidation,
    },
  });

  const paths = drops.map((drop) => ({
    params: { id: String(drop.id) },
  }));

  return paths;
}

export async function getIndividualDropsPageData(prisma: PrismaClient, id: number) {
  const drop = await prisma.drop.findFirst({
    include: {
      NftContract: { include: { Artist: true } },
      Lotteries: { include: { Nfts: true } },
      Auctions: { include: { Nft: true } },
    },
    where: {
      id,
      ...FilterDropApprovedOnly,
      ...FilterDropContractValidation,
    },
  });

  return drop;
}

export async function getArtistsPageData(prisma: PrismaClient) {
  let artists = await prisma.user.findMany({
    take: 10,
    where: {
      ...FilterUserIsArtist,
    },
  });

  return artists;
}

export async function getIndividualArtistsPagePaths(prisma: PrismaClient) {
  let artists = await prisma.user.findMany({
    where: { ...FilterUserIsArtist },
    take: 20,
  });

  const paths = artists.map((artist) => ({
    params: { id: String(artist.walletAddress) },
  }));

  return paths;
}

export async function getIndividualArtistsPageData(prisma: PrismaClient, walletAddress: string) {
  const artist = await prisma.user.findUnique({
    where: { walletAddress },
  });
  return artist;
}
