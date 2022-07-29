import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/client';
import { Nft, OfferState, User } from '@prisma/client';
import { getNFTContract } from '@/utilities/contracts';
import { ethers } from 'ethers';
import { getSession } from 'next-auth/react';
import { CollectedListingNft, Nft_include_NftContractAndOffers } from '@/prisma/types';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const {
    query: { action },
  } = request;
  switch (action) {
    case 'GetListingNftsByArtist':
      await getListingNftsByArtist(request.query.address as string, response);
      break;
    case 'GetListingNftsByOwner':
      await getListingNftsByOwner(request, response);
      break;
    case 'UpdateOwner':
      await updateOwner(Number(request.query.id), response);
      break;
    default:
      response.status(500);
  }
  response.end();
}

async function getListingNftsByArtist(artistAddress: string, response: NextApiResponse) {
  console.log(`getListingNftsByArtist(${artistAddress})`);
  try {
    const result = await prisma.nft.findMany({
      where: { artistAddress },
      include: {
        NftContract: true,
        Offers: true,
      },
    });
    response.json(result as Nft_include_NftContractAndOffers[]);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}

async function getListingNftsByOwner(request: NextApiRequest, response: NextApiResponse) {
  const session = await getSession({ req: request });
  const ownerAddress: string = session?.address as string;
  if (!session || !ownerAddress) {
    return;
  }
  console.log(`getListingNftsByOwner(${ownerAddress})`);
  try {
    const nfts = new Array<CollectedListingNft>();
    const result = await prisma.nft.findMany({ 
      where: { ownerAddress },
      include: { NftContract: { include: { Artist: true } } }
    });
    result.forEach(item => nfts.push(flatten(item, item.NftContract?.Artist!)));
    response.json(nfts);
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
    if (ownerAddress == ethers.constants.AddressZero) {
      throw new Error('Token has no owner or was not found in contract');
    }
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

function flatten(nft: Nft, artist: User): CollectedListingNft {
  return {
    nftId: nft.id,
    nftName: nft.name,
    artistUsername: artist.username!,
    artistDisplayName: artist.displayName!,
    artistProfilePicture: artist.profilePicture!,
    s3Path: nft.s3Path,
    isVideo: nft.isVideo,
  };
}