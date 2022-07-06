import { Prisma, Drop, User, Nft } from '@prisma/client';
import type { DropWhereInput } from '@prisma/client';

export type { User, Drop, Nft };

export type Auction_include_DropNftArtist = Prisma.AuctionGetPayload<{
  include: {
    Nft: true;
    Drop: {
      include: {
        Artist: true;
      };
    };
  };
}>;

export type Auction_include_Nft = Prisma.AuctionGetPayload<{
  include: { Nft: true };
}>;

export type AuctionNftWithArtist = Prisma.AuctionGetPayload<{
  include: {
    Nft: true;
    Drop: {
      include: {
        Artist: true;
      };
    };
  };
}>;

export type Game = Auction_include_Nft | Lottery_include_Nft;

export type Drop_include_GamesAndArtist = Prisma.DropGetPayload<{
  include: {
    Lotteries: true;
    Auctions: true;
    Artist: true;
  };
}>;

export type DropWithArtist = Prisma.DropGetPayload<{
  include: {
    Artist: true;
  };
}>;

export type DropFull = Prisma.DropGetPayload<{
  include: {
    Artist: true;
    Auctions: { include: { Nft: true } };
    Lotteries: { include: { Nfts: true } };
    PrimarySplitter: { include: { SplitterEntries: true } };
    SecondarySplitter: { include: { SplitterEntries: true } };
    Whitelist: { include: { WhitelistEntries: true } };
  };
}>;

export interface GamePrize {
  nftId: number;
  dropId: number;
  auctionId?: number;
  lotteryId?: number;
  lotteryTicketNumber?: number;
  lotteryProof?: string;
  nftName: string;
  artistUsername: string;
  artistDisplayName: string;
  artistProfilePicture: string;
  s3Path: string;
  isVideo: boolean;
  claimedAt?: Date;
}

export type Lottery_include_Nft = Prisma.LotteryGetPayload<{
  include: { Nfts: true };
}>;

export type LotteryWithNftsAndArtist = Prisma.LotteryGetPayload<{
  include: {
    Nfts: true;
    Drop: {
      include: {
        Artist: true;
      };
    };
  };
}>;

export type PrizeWithNftAndArtist = Prisma.PrizeProofGetPayload<{
  include: {
    Nft: {
      include: {
        Lottery: {
          include: {
            Drop: {
              include: {
                Artist: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type SafeUserUpdate = Partial<
  Pick<User, 'displayName' | 'username' | 'email' | 'bio' | 'profilePicture'>
>;

export type Splitter_include_Entries = Prisma.SplitterGetPayload<{
  include: {
    SplitterEntries: true;
  };
}>;
