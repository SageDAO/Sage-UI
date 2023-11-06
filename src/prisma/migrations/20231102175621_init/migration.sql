-- CreateEnum
CREATE TYPE "OfferState" AS ENUM ('ACTIVE', 'USED', 'CANCELLED', 'INVALID');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('ETH_ASH');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ARTIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "WhitelistType" AS ENUM ('WALLET', 'ERC20', 'ERC721', 'ERC1155', 'MERKLE');

-- CreateEnum
CREATE TYPE "SaleEventType" AS ENUM ('LOTTERY', 'AUCTION', 'MARKETPLACE');

-- CreateTable
CREATE TABLE "Drop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" CHAR(42),
    "bannerImageS3Path" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mobileCoverS3Path" TEXT,
    "tileImageS3Path" TEXT,
    "featuredMediaS3Path" TEXT,
    "artistAddress" CHAR(42) NOT NULL,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lottery" (
    "id" SERIAL NOT NULL,
    "dropId" INTEGER NOT NULL,
    "isRefundable" BOOLEAN NOT NULL DEFAULT false,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "contractAddress" CHAR(42),
    "costPerTicketTokens" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "costPerTicketPoints" INTEGER NOT NULL DEFAULT 0,
    "maxTickets" INTEGER NOT NULL DEFAULT 0,
    "maxTicketsPerUser" INTEGER NOT NULL DEFAULT 0,
    "whitelistId" INTEGER,
    "prizesAwardedAt" TIMESTAMP(3),
    "endTime" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lottery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" SERIAL NOT NULL,
    "dropId" INTEGER NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3),
    "minimumPrice" TEXT,
    "settled" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "nftId" INTEGER NOT NULL,
    "winnerAddress" CHAR(42),
    "claimedAt" TIMESTAMP(3),
    "contractAddress" CHAR(42),

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitEntry" (
    "id" SERIAL NOT NULL,
    "destinationAddress" CHAR(42) NOT NULL,
    "splitterId" INTEGER NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SplitEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Splitter" (
    "id" SERIAL NOT NULL,
    "splitterAddress" CHAR(42),

    CONSTRAINT "Splitter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Whitelist" (
    "id" SERIAL NOT NULL,
    "contractAddress" CHAR(42) NOT NULL,
    "targetAddress" CHAR(42),
    "tokenId" INTEGER,
    "minBalance" INTEGER,
    "name" TEXT NOT NULL,
    "Type" "WhitelistType" NOT NULL,

    CONSTRAINT "Whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nft" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadataPath" TEXT,
    "arweavePath" TEXT,
    "s3Path" TEXT NOT NULL,
    "s3PathOptimized" TEXT NOT NULL,
    "tags" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "numberOfEditions" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "lotteryId" INTEGER,
    "price" DOUBLE PRECISION,
    "ownerAddress" CHAR(42),
    "artistAddress" CHAR(42),

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NftContract" (
    "artistAddress" CHAR(42) NOT NULL,
    "contractAddress" CHAR(42),
    "royaltyPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "splitterId" INTEGER,

    CONSTRAINT "NftContract_pkey" PRIMARY KEY ("artistAddress")
);

-- CreateTable
CREATE TABLE "PrizeProof" (
    "winnerAddress" CHAR(42) NOT NULL,
    "proof" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "nftId" INTEGER NOT NULL,
    "ticketNumber" INTEGER NOT NULL,
    "lotteryId" INTEGER NOT NULL,
    "uri" TEXT NOT NULL,

    CONSTRAINT "PrizeProof_pkey" PRIMARY KEY ("lotteryId","winnerAddress","nftId")
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "blockNumber" INTEGER NOT NULL,
    "blockTimestamp" INTEGER NOT NULL,
    "from" CHAR(42) NOT NULL,
    "to" CHAR(42) NOT NULL,
    "value" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "id" SERIAL NOT NULL,
    "txHash" CHAR(66) NOT NULL,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarnedPoints" (
    "address" CHAR(42) NOT NULL,
    "totalPointsEarned" BIGINT NOT NULL DEFAULT 0,
    "signedMessage" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarnedPoints_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "RewardType" (
    "type" "AssetType" NOT NULL,
    "rewardRate" DOUBLE PRECISION NOT NULL,
    "lastBlockInspected" INTEGER NOT NULL,
    "chainId" INTEGER NOT NULL,
    "contract" CHAR(42) NOT NULL,
    "startingBlock" INTEGER NOT NULL,
    "positionSizeLimit" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "RewardType_pkey" PRIMARY KEY ("type")
);

-- CreateTable
CREATE TABLE "User" (
    "walletAddress" CHAR(42) NOT NULL,
    "email" VARCHAR(40),
    "twitterUsername" VARCHAR(40),
    "instagramUsername" VARCHAR(40),
    "webpage" VARCHAR(50),
    "mediumUsername" VARCHAR(40),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "bio" VARCHAR(400),
    "ashBalanceAtCreation" TEXT NOT NULL DEFAULT '0',
    "profilePicture" TEXT,
    "country" TEXT,
    "state" TEXT,
    "bannerImageS3Path" TEXT,
    "receiveEmailNotification" BOOLEAN NOT NULL DEFAULT true,
    "username" VARCHAR(40),

    CONSTRAINT "User_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "signer" CHAR(42) NOT NULL,
    "nftContractAddress" CHAR(42) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "nftId" INTEGER NOT NULL,
    "expiresAt" INTEGER NOT NULL,
    "isSellOffer" BOOLEAN NOT NULL,
    "signedOffer" TEXT NOT NULL,
    "state" "OfferState" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "featuredDropId" INTEGER,
    "welcomeMessage" TEXT NOT NULL,
    "gasLimitForTxs" INTEGER NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "walletAddress" CHAR(42) NOT NULL,
    "followedAddress" CHAR(42) NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("walletAddress","followedAddress")
);

-- CreateTable
CREATE TABLE "SaleEvent" (
    "id" SERIAL NOT NULL,
    "eventType" "SaleEventType" NOT NULL,
    "eventId" INTEGER NOT NULL,
    "seller" CHAR(42) NOT NULL,
    "buyer" CHAR(42) NOT NULL,
    "amountTokens" DOUBLE PRECISION NOT NULL,
    "amountPoints" INTEGER,
    "amountUSD" DOUBLE PRECISION,
    "txHash" CHAR(66),
    "blockTimestamp" INTEGER NOT NULL,

    CONSTRAINT "SaleEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" SERIAL NOT NULL,
    "buyer" CHAR(42) NOT NULL,
    "lotteryId" INTEGER NOT NULL,
    "refundableTokens" DOUBLE PRECISION NOT NULL,
    "blockTimestamp" INTEGER,
    "txHash" CHAR(66),

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BidHistory" (
    "id" SERIAL NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "bidderAddress" CHAR(42) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "blockTimestamp" INTEGER NOT NULL,

    CONSTRAINT "BidHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userFavoriteDrops" (
    "A" INTEGER NOT NULL,
    "B" CHAR(42) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Auction_nftId_key" ON "Auction"("nftId");

-- CreateIndex
CREATE UNIQUE INDEX "NftContract_contractAddress_key" ON "NftContract"("contractAddress");

-- CreateIndex
CREATE INDEX "TokenTransaction_from_to_idx" ON "TokenTransaction"("from", "to");

-- CreateIndex
CREATE INDEX "User_walletAddress_idx" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Config_featuredDropId_key" ON "Config"("featuredDropId");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_buyer_lotteryId_key" ON "Refund"("buyer", "lotteryId");

-- CreateIndex
CREATE UNIQUE INDEX "_userFavoriteDrops_AB_unique" ON "_userFavoriteDrops"("A", "B");

-- CreateIndex
CREATE INDEX "_userFavoriteDrops_B_index" ON "_userFavoriteDrops"("B");

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_artistAddress_fkey" FOREIGN KEY ("artistAddress") REFERENCES "NftContract"("artistAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("walletAddress") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lottery" ADD CONSTRAINT "Lottery_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lottery" ADD CONSTRAINT "Lottery_whitelistId_fkey" FOREIGN KEY ("whitelistId") REFERENCES "Whitelist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitEntry" ADD CONSTRAINT "SplitEntry_splitterId_fkey" FOREIGN KEY ("splitterId") REFERENCES "Splitter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_lotteryId_fkey" FOREIGN KEY ("lotteryId") REFERENCES "Lottery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_artistAddress_fkey" FOREIGN KEY ("artistAddress") REFERENCES "NftContract"("artistAddress") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NftContract" ADD CONSTRAINT "NftContract_splitterId_fkey" FOREIGN KEY ("splitterId") REFERENCES "Splitter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NftContract" ADD CONSTRAINT "NftContract_artistAddress_fkey" FOREIGN KEY ("artistAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrizeProof" ADD CONSTRAINT "PrizeProof_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrizeProof" ADD CONSTRAINT "PrizeProof_lotteryId_fkey" FOREIGN KEY ("lotteryId") REFERENCES "Lottery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrizeProof" ADD CONSTRAINT "PrizeProof_winnerAddress_fkey" FOREIGN KEY ("winnerAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarnedPoints" ADD CONSTRAINT "EarnedPoints_address_fkey" FOREIGN KEY ("address") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_featuredDropId_fkey" FOREIGN KEY ("featuredDropId") REFERENCES "Drop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_lotteryId_fkey" FOREIGN KEY ("lotteryId") REFERENCES "Lottery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidHistory" ADD CONSTRAINT "BidHistory_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidHistory" ADD CONSTRAINT "BidHistory_bidderAddress_fkey" FOREIGN KEY ("bidderAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFavoriteDrops" ADD CONSTRAINT "_userFavoriteDrops_A_fkey" FOREIGN KEY ("A") REFERENCES "Drop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFavoriteDrops" ADD CONSTRAINT "_userFavoriteDrops_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("walletAddress") ON DELETE CASCADE ON UPDATE CASCADE;
