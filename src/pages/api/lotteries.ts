import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/prisma/client';

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const {
    query: { action },
  } = request;
  switch (action) {
    case 'GetLottery':
      await getLottery(Number(request.query.lotteryId), response);
      break;
    case 'GetLotteryWinners':
      await getLotteryWinners(Number(request.query.lotteryId), response);
      break;
    case 'GetRefund':
      await getRefund(request, response);
      break;
    case 'GetRefunds':
      await getRefunds(request, response);
      break;
    default:
      response.status(500);
  }
  response.end();
}

async function getLottery(lotteryId: number, response: NextApiResponse) {
  console.log(`getLottery(${lotteryId})`);
  if (isNaN(lotteryId)) {
    response.status(500);
  } else {
    try {
      const lottery = await prisma.lottery.findFirst({
        where: { id: lotteryId },
        include: {
          Nfts: true,
          Drop: { include: { NftContract: { include: { Artist: true } } } },
        },
      });
      response.json(lottery);
    } catch (e) {
      console.log({ e });
      response.status(500);
    }
  }
}

async function getLotteryWinners(lotteryId: number, response: NextApiResponse) {
  console.log(`getLotteryWinners(${lotteryId})`);
  if (isNaN(lotteryId)) {
    response.status(500);
  } else {
    try {
      const winners = new Set<string>();
      const result = await prisma.prizeProof.findMany({ where: { lotteryId } });
      for (const w of result) {
        winners.add(w.winnerAddress);
      }
      response.json(Array.from(winners));
    } catch (e) {
      console.log({ e });
      response.status(500);
    }
  }
}

async function getRefund(request: NextApiRequest, response: NextApiResponse) {
  const lotteryId = Number(request.query.lotteryId);
  const session = await getSession({ req: request });
  const { address: walletAddress } = session!;
  if (!session || !walletAddress || isNaN(lotteryId)) {
    response.json([]);
    return;
  }
  const data = await prisma.refund.findMany({ where: { buyer: walletAddress, lotteryId } });
  console.log(`getRefund(${walletAddress}, ${lotteryId}) :: ${data.length} refunds`);
  response.json(data.length > 0 ? data[0] : null);
}

async function getRefunds(request: NextApiRequest, response: NextApiResponse) {
  const session = await getSession({ req: request });
  const { address: walletAddress } = session!;
  if (!session || !walletAddress) {
    response.json([]);
    return;
  }
  const idParam = Number(request.query.id);
  const lotteryId = isNaN(idParam) ? undefined : idParam;
  const data = await prisma.refund.findMany({ where: { buyer: walletAddress, lotteryId } });
  console.log(`getRefunds(${walletAddress}) :: ${data.length} refunds`);
  response.json(data);
}

export default handler;
