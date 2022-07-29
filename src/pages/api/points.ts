import { EarnedPoints } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/client';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, response: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    response.status(401).end('Not Authenticated');
    return;
  }
  const { address: walletAddress } = session!;
  const { method } = req;
  switch (method) {
    case 'GET':
      await getEarnedPoints(walletAddress as string, response);
      return;
    default:
      response.status(500).end();
  }
};

export interface GetEarnedPointsResponse extends Omit<EarnedPoints, 'totalPointsEarned'> {
  totalPointsEarned: string;
}

async function getEarnedPoints(walletAddress: string, response: NextApiResponse) {
  const dbPoints: EarnedPoints | null = await prisma.earnedPoints.findUnique({
    where: {
      address: walletAddress,
    },
  });
  if (!dbPoints) {
    response
      .status(200)
      .json({
        address: walletAddress,
        totalPointsEarned: BigInt(0).valueOf(),
        signedMessage: '',
        updatedAt: new Date(),
      } as EarnedPoints);
    return;
  }

  const res: GetEarnedPointsResponse = {
    address: dbPoints?.address,
    totalPointsEarned: dbPoints?.totalPointsEarned.toString(),
    signedMessage: dbPoints.signedMessage,
    updatedAt: dbPoints.updatedAt,
  };
  response.status(200).json(res);
  response.end();
}

export default handler;
