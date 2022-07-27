import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/client';
import { OfferState } from '@prisma/client';
import { getNFTContract } from '@/utilities/contracts';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const {
    query: { action },
  } = request;
  switch (action) {
    case 'GetArtistNfts':
      await getArtistNfts(request.query.address as string, response);
      break;
    case 'UpdateOwner':
      await updateOwner(Number(request.query.id), response);
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
      include: {
        NftContract: true,
        Offers: true,
      },
    });
    response.json(result);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}

async function updateOwner(id: number, response: NextApiResponse) {
  console.log(`updateOwner(${id})`);
  try {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { Nft: { include: { NftContract: true } } },
    });
    if (!offer || offer.state != OfferState.ACTIVE) {
      throw new Error('Offer does not exist or is not active');
    }
    const nftContract = await getNFTContract(offer.nftContractAddress);
    const ownerAddress = await nftContract.ownerOf(offer.nftId);
    console.log(`updateOwner() :: Owner of token ${offer.nftId} on contract ${offer.nftContractAddress} is ${ownerAddress}`);
    await prisma.offer.update({
      where: { id },
      data: { state: OfferState.USED },
    });
    await prisma.nft.update({
      where: { id: offer.nftId },
      data: { ownerAddress },
    });
    response.json(ownerAddress);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}
