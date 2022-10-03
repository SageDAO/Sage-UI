import { Prisma, Drop, User, Nft, Auction, Lottery, PrizeProof } from '@prisma/client';
import type { DropWhereInput } from '@prisma/client';

export type { User, Drop, Nft };

export interface ArtistSales {
  username: string;
  walletAddress: string;
  nftCountTotal: number;
  amountTotalUSD: number;
  highestSaleUSD: number;
	profilePicture: string;
	salesChartData?: any[];
}

// interface SalesChart {

// }

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

export type CollectedListingNft = Omit<GamePrize, 'dropId' | 'createdAt', 'uri'>;

export type Drop_include_GamesAndArtist = Prisma.DropGetPayload<{
  include: {
    Lotteries: { include: { Nfts: true }};
    Auctions: { include: { Nft: true }};
    NftContract: {
      include: {
        Artist: true;
      };
    };
  };
}>;

export type DropWithArtist = Prisma.DropGetPayload<{
  include: {
    NftContract: {
      include: {
        Artist: true;
      };
    };
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

export type Game = Auction_include_Nft | Lottery_include_Nft;

export type GamePrize = {
  nftId: Nft['id'];
  dropId: Drop['id'];
  uri: Nft['metadataPath'];
  auctionId?: Auction['id'];
  lotteryId?: Lottery['id'];
  lotteryProof?: PrizeProof['proof'];
  nftName: Nft['name'];
  artistUsername: User['username'];
  artistProfilePicture: User['profilePicture'];
  s3Path: Nft['s3Path'];
  s3PathOptimized: Nft['s3PathOptimized'];
  claimedAt?: PrizeProof['claimedAt'];
};

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

export type Nft_include_NftContractAndOffers = Prisma.NftGetPayload<{
  include: { NftContract: true; Offers: true };
}>;

export type PrizeWithNftAndArtist = Prisma.PrizeProofGetPayload<{
  include: {
    Nft: {
      include: {
        Lottery: {
          include: {
            Drop: {
              include: {
                NftContract: { include: { Artist: true } };
              };
            };
          };
        };
      };
    };
  };
}>;

export type SafeUserUpdate = Partial<
  Pick<
    User,
    | 'username'
    | 'email'
    | 'bio'
    | 'profilePicture'
    | 'mediumUsername'
    | 'twitterUsername'
    | 'instagramUsername'
    | 'webpage'
    | 'bannerImageS3Path'
  >
>;

export type Splitter_include_Entries = Prisma.SplitterGetPayload<{
  include: {
    SplitterEntries: true;
  };
}>;

export type User_include_EarnedPoints = Prisma.UserGetPayload<{
  include: {
    EarnedPoints: true;
  };
}>;

export type User_include_EarnedPointsAndNftContracts = Prisma.UserGetPayload<{
  include: {
    EarnedPoints: true;
    NftContract: true;
  };
}>;

export type User_include_NftContract = Prisma.UserGetPayload<{
  include: {
    NftContract: true;
  };
}>;
