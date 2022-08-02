import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrizeProof } from '@prisma/client';
import { getSession } from 'next-auth/react';
import prisma from '@/prisma/client';
import { GamePrize, PrizeWithNftAndArtist } from '@/prisma/types';

function flatten(dbPrize: PrizeWithNftAndArtist): GamePrize {
  return {
    nftId: dbPrize.nftId,
    dropId: dbPrize.Nft.Lottery?.Drop.id!,
    lotteryId: dbPrize.Nft.Lottery?.id!,
    lotteryProof: dbPrize.proof,
    nftName: dbPrize.Nft.name,
    artistUsername: dbPrize.Nft.Lottery?.Drop.NftContract.Artist.username!,
    artistProfilePicture: dbPrize.Nft.Lottery?.Drop.NftContract.Artist.profilePicture!,
    s3Path: dbPrize.Nft.s3Path,
    isVideo: dbPrize.Nft.isVideo,
    claimedAt: dbPrize.claimedAt || undefined,
  };
}

export default async function (request: NextApiRequest, response: NextApiResponse) {
  const {
    query: { action, lotteryId },
    body: { winnerAddress, nftId },
  } = request;
  const session = await getSession({ req: request });
  const { address: walletAddress } = session!;
  switch (action) {
    case 'IsLotteryDrawn':
      await isLotteryDrawn(Number(lotteryId), response);
      break;
    case 'GetClaimedPrizes':
      await getClaimedPrizes(walletAddress as string, response);
      break;
    case 'GetUnclaimedPrizes':
      await getUnclaimedPrizes(walletAddress as string, response);
      break;
    case 'GetPrizesByUserAndLottery':
      await getPrizesByUserAndLottery(Number(lotteryId), walletAddress as string, response);
      break;
    case 'UpdatePrizeClaimedDate':
      await updatePrizeClaimedDate(Number(lotteryId), winnerAddress, nftId, response);
      break;
    case 'GetPrizesStats':
      await getPrizesStats(response);
      break;
    case 'GetLotteryPrizes':
      await getLotteryPrizes(Number(lotteryId), response);
      break;
  }
  response.end();
}

async function getClaimedPrizes(walletAddress: string, response: NextApiResponse) {
  let prizeNfts: GamePrize[] = [];
  if (walletAddress && walletAddress != '') {
    try {
      const prizes: PrizeWithNftAndArtist[] = await prisma.prizeProof.findMany({
        where: {
          winnerAddress: walletAddress,
          NOT: {
            claimedAt: null,
          },
        },
        include: {
          Nft: {
            include: {
              Lottery: {
                include: { Drop: { include: { NftContract: { include: { Artist: true } } } } },
              },
            },
          },
        },
      });
      prizes.forEach((prize) => prizeNfts.push(flatten(prize)));
    } catch (e) {
      console.log(e);
    }
  }
  console.log(`getClaimedPrizes(${walletAddress}) :: ${prizeNfts.length}`);
  response.status(200).json(prizeNfts);
}

async function getUnclaimedPrizes(walletAddress: string, response: NextApiResponse) {
  let prizeNfts: GamePrize[] = [];
  if (walletAddress && walletAddress != '') {
    try {
      const prizes: PrizeWithNftAndArtist[] = await prisma.prizeProof.findMany({
        where: {
          winnerAddress: walletAddress,
          claimedAt: null,
        },
        include: {
          Nft: {
            include: {
              Lottery: {
                include: { Drop: { include: { NftContract: { include: { Artist: true } } } } },
              },
            },
          },
        },
      });
      prizes.forEach((prize) => prizeNfts.push(flatten(prize)));
    } catch (e) {
      console.log(e);
    }
  }
  console.log(`getUnclaimedPrizes(${walletAddress}) :: ${prizeNfts.length}`);
  response.status(200).json(prizeNfts);
}

async function getPrizesByUserAndLottery(
  lotteryId: number,
  walletAddress: string,
  response: NextApiResponse
) {
  let prizeNfts: GamePrize[] = [];
  if (!walletAddress || walletAddress == '') {
    response.status(200).json(prizeNfts);
  }
  try {
    const prizes: PrizeWithNftAndArtist[] | null = await prisma.prizeProof.findMany({
      where: {
        winnerAddress: walletAddress,
        lotteryId,
      },
      include: {
        Nft: {
          include: {
            Lottery: {
              include: { Drop: { include: { NftContract: { include: { Artist: true } } } } },
            },
          },
        },
      },
    });
    prizes.forEach((prize) => prizeNfts.push(flatten(prize)));
  } catch (e) {
    console.log(e);
  }
  console.log(`getPrizesByUserAndLottery(${lotteryId}, ${walletAddress}) = ${prizeNfts.length}`);
  response.status(200).json(prizeNfts);
}

/**
 * Returns a map containing the counting of drawn and claimed prizes per lottery.
 * [lotteryId] => { prizesDrawn, prizesClaimed }
 */
async function getPrizesStats(response: NextApiResponse) {
  interface IResult {
    [lotteryId: string]: IResultItem;
  }

  interface IResultItem {
    numPrizesDrawn: number;
    numPrizesClaimed: number;
  }

  let prizesStats: IResult = {};
  try {
    const result = await prisma.$queryRaw<any[]>(
      Prisma.sql`select a."lotteryId", a."drawn", b."claimed" from
      (select "lotteryId", count(*) as "drawn" from "PrizeProof" group by "lotteryId") as a
      left join
      (select "lotteryId", count(*) as "claimed" from "PrizeProof" where ("claimedAt" is not null) group by "lotteryId") as b
      on (a."lotteryId" = b."lotteryId")`
    );
    result.forEach((row) => {
      prizesStats[row.lotteryId] = {
        numPrizesDrawn: row.drawn,
        numPrizesClaimed: row.claimed ? row.claimed : 0,
      };
    });
  } catch (e) {
    console.log(e);
  }
  response.status(200).json(prizesStats);
}

/**
 * Returns a boolean that depends on prizes being drawn for a lottery.
 */
async function isLotteryDrawn(lotteryId: number, response: NextApiResponse) {
  try {
    const prizeCount = await prisma.prizeProof.aggregate({
      _count: { winnerAddress: true },
      where: {
        lotteryId,
      },
    });
    var isDrawn = prizeCount._count.winnerAddress > 0;
    console.log(`isLotteryDrawn(${lotteryId}) = ${isDrawn}`);
    response.status(200).json(isDrawn);
  } catch (e) {
    console.log(e);
    response.status(500).end();
  }
}

/**
 * Returns all data from PrizeProof table for a given lotteryId.
 */
async function getLotteryPrizes(lotteryId: number, response: NextApiResponse) {
  try {
    const allPrizes: PrizeProof[] | null = await prisma.prizeProof.findMany({
      where: {
        lotteryId,
      },
    });
    console.log(`getLotteryPrizes(${lotteryId}) = ${allPrizes.length}`);
    response.status(200).json(allPrizes);
  } catch (e) {
    console.log(e);
    response.status(500).end();
  }
}

/**
 * Updates the "claimedAt" date field in the PrizeProof table, after a successful contract mint.
 */
async function updatePrizeClaimedDate(
  lotteryId: number,
  winnerAddress: string,
  nftId: number,
  response: NextApiResponse
) {
  let now = new Date();
  try {
    await prisma.prizeProof.update({
      where: {
        lotteryId_winnerAddress_nftId: {
          winnerAddress,
          lotteryId,
          nftId,
        },
      },
      data: {
        claimedAt: now,
      },
    });
    response.status(200).json({ claimedAt: now });
  } catch (e) {
    console.log(e);
    response.status(500).end();
  }
}
