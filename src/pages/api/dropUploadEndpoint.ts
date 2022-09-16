import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import prisma from '@/prisma/client';
import { Role } from '@prisma/client';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import Transaction from 'arweave/node/lib/transaction';
import { computePrimes } from 'jwk-rsa-compute-primes';
import { getSession } from 'next-auth/react';
import { createS3SignedUrl } from '@/utilities/awsS3';

const arweaveJwk = computePrimes(JSON.parse(process.env.ARWEAVE_JSON_JWK || ''));

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 120000,
});

/*
 * TODO authenticate requests coming from the (external) upload app
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
  await setupCors(request, response);
  const {
    query: { action },
  } = request;
  switch (action) {
    case 'GetArtistNftContractAddress':
      await getArtistNftContractAddress(String(request.query.artistAddress), response);
      break;
    case 'CreateS3SignedUrl':
      await getS3SignedUrl(
        String(request.query.bucket),
        String(request.query.filename),
        response
      );
      break;
    case 'CopyFromS3toArweave':
      await copyFromS3toArweave(String(request.query.s3Path), response);
      break;
    case 'UploadNftMetadataToArweave':
      await uploadNftMetadataToArweave(request.body, response);
      break;
    case 'InsertDrop':
      await insertDrop(request.body, response);
      break;
    case 'InsertAuction':
      await insertAuction(request.body, response);
      break;
    case 'InsertDrawing':
      await insertDrawing(request.body, response);
      break;
    case 'InsertNft':
      await insertNft(request.body, response);
      break;
    case 'DeleteNft':
      await deleteNft(Number(request.query.id), request, response);
      break;
    default:
      response.status(400).json('Bad Request');
  }
  response.end();
}

async function setupCors(request: NextApiRequest, response: NextApiResponse) {
  await NextCors(request, response, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
}

async function getArtistNftContractAddress(artistAddress: string, response: NextApiResponse) {
  const result = await prisma.nftContract.findUnique({
    where: { artistAddress }
  });
  const nftContractAddress = result ? result.contractAddress : null;
  response.json({nftContractAddress});
}

async function getS3SignedUrl(bucket: string, filename: string, response: NextApiResponse) {
  const { uploadUrl, getUrl } = createS3SignedUrl(bucket, filename);
  response.json({ uploadUrl, getUrl });
}

async function copyFromS3toArweave(s3Path: string, response: NextApiResponse) {
  var balance = '';
  try {
    const walletAddress = await arweave.wallets.jwkToAddress(arweaveJwk);
    balance = await arweave.wallets.getBalance(walletAddress);
    const fileContent = await fetchFileContent(s3Path);
    const filename = s3Path.split('/').pop() as string;
    const tx = await sendArweaveTransaction(
      filename,
      fileContent,
      inferMimeType(s3Path),
      arweaveJwk
    );
    response.json({ id: tx.id, balance });
  } catch (e: any) {
    console.log(e);
    response.json({ error: (e as Error).message, balance });
  }
}

async function sendArweaveTransaction(
  filename: string,
  data: Uint8Array,
  contentType: string,
  jwk: JWKInterface
): Promise<Transaction> {
  const transaction = await arweave.createTransaction({ data }, jwk);
  transaction.addTag('Content-Type', contentType);
  await arweave.transactions.sign(transaction, jwk);
  await arweave.transactions.post(transaction);
  // const uploader = await arweave.transactions.getUploader(transaction);
  // while (!uploader.isComplete) {
  //   await uploader.uploadChunk();
  //   console.log(
  //     `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
  //   );
  // }
  console.log(`sendArweaveTransaction() :: ${filename} -> ${transaction.id}`);
  return transaction;
}

async function uploadNftMetadataToArweave(nftMetadataFile: any, response: NextApiResponse) {
  var metadataType = 'application/json';
  const tx = await sendArweaveTransaction(
    nftMetadataFile.filename,
    nftMetadataFile.data,
    metadataType,
    arweaveJwk
  );
  const walletAddress = await arweave.wallets.jwkToAddress(arweaveJwk);
  const balance = await arweave.wallets.getBalance(walletAddress);
  response.json({ id: tx.id, balance });
}

/**
 * Manifests are used for 1155's
 * Based upon https://github.com/ArweaveTeam/arweave/wiki/Path-Manifests#schema
 */
function createArweaveManifest(nftMetadataFiles: any[]): string {
  var paths = '';
  for (var i = 0; i < nftMetadataFiles.length; i++) {
    paths += `\n      "${nftMetadataFiles[i].filename}": { "id": "${nftMetadataFiles[i].txId}" }`;
    paths += i < nftMetadataFiles.length - 1 ? ',' : '\n     ';
  }
  var manifest = `
  {
    "manifest": "arweave/paths",
    "version": "0.1.0",
    "paths": { ${paths} }
  }
  `;
  return manifest;
}

async function insertDrop(data: any, response: NextApiResponse) {
  console.log('insertDrop()');
  try {
    // Create user if it doesn't exist
    await prisma.user.upsert({
      where: {
        walletAddress: data.artistWallet,
      },
      update: {},
      create: {
        walletAddress: data.artistWallet,
        role: Role.ARTIST,
      },
    });
    // Create nft contract record if it doesn't exist
    const defaultRoyalty = 10;
    const royalty = parseFloat(data.rltyPercent);
    await prisma.nftContract.upsert({
      where: { artistAddress: data.artistWallet },
      update: {},
      create: {
        artistAddress: data.artistWallet,
        royaltyPercentage: isNaN(royalty) ? defaultRoyalty : royalty,
      },
    });
    // Create drop
    var record = await prisma.drop.create({
      data: {
        name: data.name,
        description: data.description || '',
        createdAt: new Date(),
        bannerImageS3Path: data.bannerImageS3Path,
        NftContract: { connect: { artistAddress: data.artistWallet } },
      },
    });
    response.json({ dropId: record.id });
  } catch (e: any) {
    console.log(e);
    response.json({ error: e.message });
  }
}

async function insertAuction(data: any, response: NextApiResponse) {
  console.log('insertAuction()');
  try {
    var record = await prisma.auction.create({
      data: {
        Drop: { connect: { id: Number(data.dropId) } },
        minimumPrice: data.minPrice,
        startTime: new Date(Number(data.startDate) * 1000),
        endTime: new Date(Number(data.endDate) * 1000),
        Nft: {
          create: {
            name: data.name,
            description: data.description || '',
            // tags: data.tags || '',
            numberOfEditions: 1,
            metadataPath: data.metadataPath,
            s3Path: data.s3Path,
            s3PathOptimized: data.s3Path,
          },
        },
      },
    });
    response.json({ auctionId: record.id, nftId: record.nftId });
  } catch (e: any) {
    console.log(e);
    response.json({ error: e.message });
  }
}

async function insertNft(data: any, response: NextApiResponse) {
  console.log('insertNft()');
  try {
    var insertData = {
      data: {
        name: data.name,
        description: data.description || '',
        // tags: data.tags || '',
        numberOfEditions: toNumber(data.numberOfEditions),
        metadataPath: data.metadataPath,
        s3Path: data.s3Path,
        s3PathOptimized: data.s3Path,
        price: data.price || undefined,
        Auction: null || {},
        Lottery: null || {},
        NftContract: null || {},
      },
    };
    // Game NFT either belongs to an Auction or to a Lottery
    if (data.auctionId) {
      insertData.data.Auction = { connect: { id: data.auctionId } };
    } else if (data.drawingId) {
      insertData.data.Lottery = { connect: { id: data.drawingId } };
    }
    if (data.artistAddress) {
      insertData.data.NftContract = { connect: { artistAddress: data.artistAddress } };
    }
    var record = await prisma.nft.create(insertData);
    response.json({ nftId: record.id });
  } catch (e: any) {
    console.log(e);
    response.json({ error: e.message });
  }
}

async function deleteNft(nftId: number, request: NextApiRequest, response: NextApiResponse) {
  console.log(`deleteNft(${nftId})`);
  const session = await getSession({ req: request });
  const { address: walletAddress } = session!;
  if (!session || !walletAddress) {
    return;
  }
  await prisma.nft.deleteMany({
    where: {
      id: nftId,
      artistAddress: walletAddress as string,
      ownerAddress: undefined,
    },
  });
}

async function insertDrawing(data: any, response: NextApiResponse) {
  console.log('insertDrawing()');
  try {
    var record = await prisma.lottery.create({
      data: {
        dropId: Number(data.dropId),
        costPerTicketTokens: toNumber(data.ticketCostTokens),
        costPerTicketPoints: toNumber(data.ticketCostPoints),
        maxTickets: toNumber(data.maxTickets),
        maxTicketsPerUser: toNumber(data.maxTicketsPerUser),
        endTime: new Date(Number(data.endDate) * 1000),
        startTime: new Date(Number(data.startDate) * 1000),
        isRefundable: 'true' == data.isRefundable,
      },
    });
    response.json({ drawingId: record.id });
  } catch (e: any) {
    console.log(e);
    response.json({ error: e.message });
  }
}

const toNumber = (val: string): number => (val ? Number(val) : 0);

async function fetchFileContent(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  return new Uint8Array(await response.arrayBuffer());
}

function inferMimeType(filename: string): string {
  const extension = filename.toLowerCase().split('.').pop();
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'gif':
      return 'image/gif';
    case 'png':
      return 'image/png';
  }
  return 'image/jpeg';
}

export default handler;
