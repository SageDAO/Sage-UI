import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/client';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const {
    query: { action, address, id },
  } = request;
  switch (action) {
    case 'GetArtistNfts':
      await getArtistNfts(address as string, response);
      break;
    case 'UpdateOwner':
      await updateOwner(Number(id), address as string, response);
      break;
    default:
      response.status(500);
  }
  response.end();
}

async function getArtistNfts(artistAddress: string, response: NextApiResponse) {
  console.log(`getArtistNfts(${artistAddress})`);
  try {
    const result = await prisma.nft.findMany({
      where: { artistAddress },
      include: { NftContract: true },
    });
    response.json(result);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}

async function updateOwner(id: number, ownerAddress: string, response: NextApiResponse) {
  console.log(`updateOwner(${id}, ${ownerAddress})`);
  try {
    const result = await prisma.nft.update({
      where: { id },
      data: { ownerAddress },
    });
    response.json(result);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}
