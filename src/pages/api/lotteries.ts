import { NextApiRequest, NextApiResponse } from 'next';
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

export default handler;
