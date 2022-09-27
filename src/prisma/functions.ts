import { parameters } from '../constants/config';
import { ArtistSales, Drop_include_GamesAndArtist, User } from '@/prisma/types';
import { PrismaClient, Prisma, Role } from '@prisma/client';
import { BigNumber } from 'ethers';

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

export async function getSageMediumData() {
  const mediumURL = parameters.MEDIUM_URL;
  const response = await fetch(mediumURL);
  const data = await response.json();
  return data;
}

export async function getHomePageData(prisma: PrismaClient) {
  const dropIncludes = {
    NftContract: { include: { Artist: true } },
    Lotteries: { include: { Nfts: true } },
    Auctions: { include: { Nft: true } },
  };
  let drops: Drop_include_GamesAndArtist[] = await prisma.drop.findMany({
    where: { ...FilterDropApprovedOnly },
    include: dropIncludes,
    orderBy: { approvedAt: 'desc' },
    take: 8,
  });
  const config = await prisma.config.findFirst({
    include: { FeaturedDrop: { include: dropIncludes } },
  });
  const welcomeMessage = config ? config.welcomeMessage : '';
  const featuredDrop = config && config.FeaturedDrop ? config.FeaturedDrop : drops[0];
  return { featuredDrop, upcomingDrops: drops, drops, welcomeMessage };
}

export async function getDropsPageData(prisma: PrismaClient) {
  const drops = await prisma.drop.findMany({
    orderBy: { approvedAt: 'asc' },
    include: {
      NftContract: { include: { Artist: true } },
      Lotteries: { include: { Nfts: true } },
      Auctions: { include: { Nft: true } },
    },
    where: {
      ...FilterDropContractValidation,
      ...FilterDropApprovedOnly,
    },
    take: 10,
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
  // find artists who have deployed drops or minted a listing
  var query = `
    select distinct "artistAddress" from "Drop" where "approvedAt" is not null
    union
    select distinct "artistAddress" from "Nft" where "artistAddress" is not null`;
  var result = await prisma.$queryRaw(Prisma.raw(query));
  const artistWallets = (result as any).map((row: any) => ({
    walletAddress: row.artistAddress,
  }));
  return await prisma.user.findMany({
    where: { OR: artistWallets, bannerImageS3Path: { not: null } },
    take: 20,
  });
}

export async function getIndividualArtistsPagePaths(prisma: PrismaClient) {
  let artists = await prisma.user.findMany({
    where: { ...FilterUserIsArtist },
    take: 20,
  });

  const paths = artists.map((artist) => ({
    params: { id: String(artist.username) },
  }));

  return paths;
}

export async function getIndividualArtistsPageData(prisma: PrismaClient, username: string) {
  const artist = await prisma.user.findFirst({
    where: { username },
    include: { NftContract: true },
  });
  return artist;
}

export async function getArtistsSalesData(prisma: PrismaClient) {
  const salesData = new Map<string, ArtistSales>();
  // get list of artists' usernames, wallets and nft counts from all games, including listings
  var query = `
    select "u"."walletAddress", "u"."username", "u"."profilePicture", 
	    coalesce("a"."auctionCount", 0) + coalesce("b"."lotteryCount", 0) + coalesce("c"."listingCount", 0) as "nftCount"
    from "User" as "u" 
    left join (
      select "artistAddress", count(*) as "auctionCount" from "Drop", "Auction"
      where ("Auction"."dropId" = "Drop"."id") and ("Auction"."settled" = true) group by "Drop"."artistAddress"
    ) as "a" on ("u"."walletAddress" = "a"."artistAddress")
    left join (
      select "Drop"."artistAddress", count(*) as "lotteryCount" from "Drop", "Lottery", "Nft"
      where ("Lottery"."dropId" = "Drop"."id") and ("Nft"."lotteryId" = "Lottery"."id") group by "Drop"."artistAddress"
    ) as "b" on ("u"."walletAddress" = "b"."artistAddress")
    left join (
      select "artistAddress", count(*) as "listingCount" from "Nft" 
      where ("ownerAddress" is not null) and ("artistAddress" is not null) group by "artistAddress"
    ) as "c" on ("u"."walletAddress" = "c"."artistAddress")
    where "u"."role" = 'ARTIST'`;
  var result = await prisma.$queryRaw(Prisma.raw(query));
  for (const row of result as any) {
    salesData.set(row.walletAddress, <ArtistSales>{
      username: String(row.username),
      walletAddress: String(row.walletAddress),
      nftCountTotal: Number(row.nftCount),
      amountTotalUSD: 0,
      highestSaleUSD: 0,
      profilePicture: row.profilePicture,
    } as ArtistSales);
  }

  // query sales statistics
  query = `
    select "seller", sum(coalesce("amountUSD", 0)) as "amount"
    from "SaleEvent" group by ("eventType", "eventId", "seller")`;
  result = await prisma.$queryRaw(Prisma.raw(query));
	console.log(result);
  for (const row of result as any) {
    const item = salesData.get(row.seller);
    item.amountTotalUSD += row.amount;
    if (row.amount > item.highestSaleUSD) {
      item.highestSaleUSD = row.amount;
    }
  }

  return salesData;
}
