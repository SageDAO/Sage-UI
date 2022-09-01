import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/prisma/client';

export default async function (request: NextApiRequest, response: NextApiResponse) {
  const {
    query: { action },
    body,
  } = request;
  const session = await getSession({ req: request });
  const { address: walletAddress } = session!;
  if (!session || !walletAddress) {
    response.status(500);
    return;
  }
  switch (action) {
    case 'RegisterSale':
      await registerSale(walletAddress as string, body, response);
      break;
  }
  response.end();
}

async function registerSale(walletAddress: string, body: any, response: NextApiResponse) {
  // id              Int    @id @default(autoincrement())
  // eventType       SaleEventType
  // eventId         Int    // lotteryId | auctionId | nftId
  // seller          String @db.Char(42) // artistAddress
  // buyer           String @db.Char(42)
  // amountTokens    Float // ASH
  // amountPoints    Int?
  // amountUSD       Float?
  // txHash          String @db.Char(66)
  // blockTimestamp  Int
  var { eventType, eventId, amountTokens, amountPoints, buyer, txHash, blockTimestamp } = body;
  const artistAddress = findArtistAddress(eventType, Number(eventId));
  const tokenUSDValue = await getTokenUSDValue();
  const amountUSD = tokenUSDValue > 0 ? amountTokens * tokenUSDValue : null;
  const amountPixel = amountPoints && !isNaN(Number(amountPoints)) ? Number(amountPoints) : null;
  // TODO INSERT
}

async function findArtistAddress(eventType: string, eventId: number) {
  var queryResult: any;
  switch (eventType) {
    case 'LOTTERY':
      queryResult = await prisma.lottery.findUnique({
        select: { Drop: { select: { artistAddress: true } } },
        where: { id: eventId },
      });
      return queryResult.Drop.artistAddress;
    case 'AUCTION':
      queryResult = await prisma.auction.findUnique({
        select: { Drop: { select: { artistAddress: true } } },
        where: { id: eventId },
      });
      return queryResult.Drop.artistAddress;
    case 'MARKETPLACE':
      queryResult = await prisma.nft.findUnique({
        select: { artistAddress: true },
        where: { id: eventId },
      });
      return queryResult.artistAddress;
  }
  throw new Error(`Unable to find a match for (${eventType}, ${eventId})`);
}

// TODO consider caching this value
async function getTokenUSDValue(): Promise<number> {
  try {
    const result = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ASH&tsyms=USD');
    const { USD } = await result.json();
    return parseFloat(USD);
  } catch (e) {
    console.log(e);
    return 0.0;
  }
}
