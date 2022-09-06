import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { featuredDropId, welcomeMessage },
    method,
  } = req;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end('Not Authenticated');
    return;
  }

  switch (method) {
    case 'GET':
      await getConfig(res);
      break;
    case 'PATCH':
      await updateConfig(Number(featuredDropId), welcomeMessage, res);
      break;
    default:
      res.status(501).end();
  }
  res.end();
};

async function getConfig(res: NextApiResponse) {
  try {
    const result = await prisma.config.findMany({});
    if (result.length == 0) {
      res.json({
        featuredDropId: 0,
        welcomeMessage: '',
      });
    } else {
      res.json({
        featuredDropId: result[0].featuredDropId,
        welcomeMessage: result[0].welcomeMessage,
      });
    }
  } catch (e) {
    res.status(500).end;
  }
}

async function updateConfig(featuredDropId: number, welcomeMessage: string, res: NextApiResponse) {
  try {
    await prisma.config.upsert({
      where: {},
      create: { featuredDropId, welcomeMessage },
      update: { featuredDropId, welcomeMessage },
    });
  } catch (e) {
    console.log(e);
  }
}
