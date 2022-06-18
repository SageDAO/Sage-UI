import prisma from '@/prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const {
    query: { action },
  } = request;
  const session = await getSession({ req: request });
  const { address: walletAddress } = session!;
  if (!session) {
    response.status(401).end('Please Sign In');
    return;
  }
  switch (action) {
    case 'GetApprovedDrops':
      await getApprovedDrops(response);
      break;
    case 'GetDropsPendingApproval':
      await getDropsPendingApproval(response);
      break;
    case 'ApproveDrop':
      await approveDrop(request.body.id as number, walletAddress as string, response);
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
        Artist: true,
        Lotteries: { include: { Nfts: true } },
        Auctions: { include: { Nft: true } },
      },
      orderBy: {
        id: 'desc'
      }
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
        Artist: true,
      },
    });
    response.json(result);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}

async function approveDrop(id: number, walletAddress: string, response: NextApiResponse) {
  console.log(`approveDrop(${id}, ${walletAddress})`);
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
    response.json(approvedAt);
  } catch (e) {
    console.log(e);
    response.status(500);
  }
}

export default handler;
