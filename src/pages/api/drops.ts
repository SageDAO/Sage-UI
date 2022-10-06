import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/prisma/client';
import { Prisma } from '@prisma/client';
import { readPresetDropsFromS3 } from '@/utilities/awsS3-server';
import { PresetDrop } from '@/store/dropsReducer';

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
    case 'GetNftContractAddress':
      await getNftContractAddress(address as string, response);
      break;
    case 'GetPresetDrops':
      await getPresetDrops(response);
      break;
    case 'UpdateNftContractAddress':
      await updateNftContractAddress(
        request.query.artistAddress as string,
        request.query.contractAddress as string,
        response
      );
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
    case 'DeleteDrop':
      await deleteDrop(Number(id), response);
      break;
    case 'DeleteDrops':
      await deleteDrops(response);
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
        NftContract: { include: { Artist: true } },
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
      where: { approvedAt: null },
      include: {
        NftContract: { include: { Artist: true } },
        Lotteries: { include: { Nfts: true } },
        Auctions: { include: { Nft: true } },
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
        NftContract: { include: { Artist: true } },
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

async function getNftContractAddress(artistAddress: string, response: NextApiResponse) {
  console.log(`getNftContractAddress(${artistAddress})`);
  try {
    const result = await prisma.nftContract.upsert({
      where: { artistAddress },
      update: {},
      create: { artistAddress, royaltyPercentage: 10 },
    });
    response.json(result);
  } catch (e) {
    console.log({ e });
    response.status(500);
  }
}

async function getPresetDrops(response: NextApiResponse) {
  const presetDrops = await readPresetDropsFromS3();
  // Populate artists usernames & roles
  const presetArtists = presetDrops.map((item: PresetDrop) => item.artist.walletAddress);
  const dbArtists = await prisma.user.findMany({
    where: { walletAddress: { in: presetArtists } },
    select: { walletAddress: true, username: true, role: true },
  });
  for (const drop of presetDrops) {
    for (const dbArtist of dbArtists) {
      if (drop.artist.walletAddress == dbArtist.walletAddress) {
        drop.artist.username = dbArtist.username;
        drop.artist.role = dbArtist.role;
        break;
      }
    }
  }
  console.log(`getPresetDrops() :: ${presetDrops.length} items`);
  response.json(presetDrops);
}

async function updateNftContractAddress(
  artistAddress: string,
  contractAddress: string,
  response: NextApiResponse
) {
  console.log(`updateNftContractAddress(${artistAddress}, ${contractAddress})`);
  try {
    const result = await prisma.nftContract.update({
      where: { artistAddress },
      data: { contractAddress },
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
      where: { splitterId: id },
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
      where: { id },
      data: { splitterAddress: address },
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
      where: { id },
      data: { contractAddress },
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
      where: { id },
      data: { contractAddress },
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
  try {
    const { approvedAt } = await prisma.drop.update({
      where: { id: Number(id) },
      data: {
        approvedAt: new Date(),
        approvedBy: walletAddress,
      },
    });
    await prisma.auction.updateMany({
      where: { dropId: Number(id) },
      data: { isLive: true },
    });
    await prisma.lottery.updateMany({
      where: { dropId: Number(id) },
      data: { isLive: true },
    });
    response.json(approvedAt);
  } catch (e) {
    console.log(e);
    response.status(500);
  }
}

async function deleteDrop(id: number, response: NextApiResponse) {
  console.log(`deleteDrop(${id})`);
  const drop = await prisma.drop.findUnique({
    where: { id },
    include: {
      Auctions: { include: { Nft: true } },
      Lotteries: { include: { Nfts: true } },
    },
  });
  if (drop?.approvedAt) {
    response.status(500);
    return;
  }
  for (const a of drop?.Auctions!) {
    await prisma.auction.delete({ where: { id: a.id } });
    await prisma.nft.delete({ where: { id: a.nftId } });
  }
  for (const l of drop?.Lotteries!) {
    for (const n of l.Nfts) {
      await prisma.nft.delete({ where: { id: n.id } });
    }
    await prisma.lottery.delete({ where: { id: l.id } });
  }
  await prisma.drop.delete({ where: { id } });
}

async function deleteDrops(response: NextApiResponse) {
  console.log(`deleteDrops()`);
  if (process.env.NEXT_PUBLIC_APP_MODE == 'production') {
    throw new Error('Web wiping of drop data not allowed in production');
  }
  await prisma.config.updateMany({ where: {}, data: { featuredDropId: null } });
  await prisma.saleEvent.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.prizeProof.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.nft.deleteMany();
  await prisma.lottery.deleteMany();
  await prisma.drop.deleteMany();
}

export default handler;
