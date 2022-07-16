import prisma from '@/prisma/client';
import { Prisma } from '@prisma/client';
import { split } from 'cypress/types/lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const {
    query: { action, id, address },
  } = request;
  const session = await getSession({ req: request });
  if (!session) {
    response.status(401).end('Please Sign In');
    return;
  }
  const { address: walletAddress } = session!;
  switch (action) {
    case 'GetApprovedDrops':
      await getApprovedDrops(response);
      break;
    case 'GetDropsPendingApproval':
      await getDropsPendingApproval(response);
      break;
    case 'GetFullDrop':
      await getFullDrop(Number(id), response);
      break;
    case 'FindSplitterAddress':
      await findSplitterAddress(Number(id), response);
      break;
    case 'UpdateSplitterAddress':
      await updateSplitterAddress(Number(id), address as string, response);
      break;
    case 'UpdateAuctionContractAddress':
      await updateAuctionContractAddress(Number(id), address as string, response);
      break;
    case 'UpdateLotteryContractAddress':
      await updateLotteryContractAddress(Number(id), address as string, response);
      break;
    case 'UpdateApprovedDateAndIsLiveFlags':
      await updateApprovedDateAndIsLiveFlags(Number(id), walletAddress as string, response);
      break;
    default:
      response.status(500);
  }
  response.end();
}

async function getApprovedDrops(response: NextApiResponse) {
  console.log(`getApprovedDrops()`);
  try {
    const result = await prisma.drop.findMany({
      where: { approvedAt: { not: null } },
      include: {
        NftContract: {
          include: {
            Artist: true,
          }
        },
        Lotteries: { include: { Nfts: true } },
        Auctions: { include: { Nft: true } },
      },
      orderBy: {
        id: 'desc',
      },
    });
    response.json(result);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}

async function getDropsPendingApproval(response: NextApiResponse) {
  console.log(`getDropsPendingApproval()`);
  try {
    const result = await prisma.drop.findMany({
      where: {
        approvedAt: null,
      },
      include: {
        NftContract: {
          include: {
            Artist: true,
          }
        },
      },
    });
    response.json(result);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}

async function getFullDrop(id: number, response: NextApiResponse) {
  console.log(`getFullDrop(${id})`);
  try {
    const result = await prisma.drop.findUnique({
      where: { id },
      include: {
        NftContract: {
          include: {
            Artist: true,
          }
        },
        Auctions: { include: { Nft: true } },
        Lotteries: { include: { Nfts: true } },
        Whitelist: { include: { WhitelistEntries: true } },
      },
    });
    response.json(result);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}

/**
 * Finds deployed Splitter contract address(es) that matches split entries of a given id.
 */
async function findSplitterAddress(id: number, response: NextApiResponse) {
  console.log(`findSplitterAddress(${id})`);
  try {
    var splitEntries = await prisma.splitEntry.findMany({
      where: {
        splitterId: id,
      },
    });
    if (splitEntries.length! <= 1) {
      response.json([]);
      return;
    }
    var queryParams = '';
    for (var i = 0; i < splitEntries.length; i++) {
      queryParams += `SELECT "splitterId" FROM "SplitEntry" WHERE
        ("percent", "destinationAddress") = (${splitEntries[i].percent}, '${splitEntries[i].destinationAddress}')`;
      if (i != splitEntries.length - 1) {
        queryParams += ` INTERSECT `;
      }
    }
    const query = `SELECT "p".* FROM "Splitter" AS "p" JOIN (${queryParams}) AS "c"
      ON ("p"."id" = "c"."splitterId") WHERE ("p"."splitterAddress" IS NOT NULL)`;
    const result = await prisma.$queryRaw(Prisma.raw(query));
    response.json(result);
  } catch (e) {
    console.log(e);
    response.status(500);
  }
}

async function updateSplitterAddress(id: number, address: string, response: NextApiResponse) {
  console.log(`updateSplitterAddress(${id}, ${address})`);
  try {
    const result = await prisma.splitter.update({
      where: {
        id,
      },
      data: {
        splitterAddress: address,
      },
    });
    response.json(result);
  } catch (e) {
    console.log(e);
    response.status(500);
  }
}

async function updateAuctionContractAddress(
  id: number,
  contractAddress: string,
  response: NextApiResponse
) {
  console.log(`updateAuctionContractAddress(${id}, ${contractAddress})`);
  try {
    const result = await prisma.auction.update({
      where: {
        id,
      },
      data: {
        contractAddress,
      },
    });
    response.json(result);
  } catch (e) {
    console.log(e);
    response.status(500);
  }
}

async function updateLotteryContractAddress(
  id: number,
  contractAddress: string,
  response: NextApiResponse
) {
  console.log(`updateLotteryContractAddress(${id}, ${contractAddress})`);
  try {
    const result = await prisma.lottery.update({
      where: {
        id,
      },
      data: {
        contractAddress,
      },
    });
    response.json(result);
  } catch (e) {
    console.log(e);
    response.status(500);
  }
}

async function updateApprovedDateAndIsLiveFlags(
  id: number,
  walletAddress: string,
  response: NextApiResponse
) {
  console.log(`updateApprovedDateAndIsLiveFlags(${id}, ${walletAddress})`);
  let now = new Date();
  try {
    const { approvedAt } = await prisma.drop.update({
      where: {
        id: Number(id),
      },
      data: {
        approvedAt: now,
        approvedBy: walletAddress,
      },
    });
    await prisma.auction.updateMany({
      where: {
        dropId: Number(id),
      },
      data: {
        isLive: true,
      },
    });
    await prisma.lottery.updateMany({
      where: {
        dropId: Number(id),
      },
      data: {
        isLive: true,
      },
    });
    response.json(approvedAt);
  } catch (e) {
    console.log(e);
    response.status(500);
  }
}

export default handler;
