import type { NextApiRequest, NextApiResponse } from 'next';
import aws from 'aws-sdk';
import NextCors from 'nextjs-cors';
import prisma from '@/prisma/client';
import { Role } from '@prisma/client';
import { createUcanRequestToken } from '@/utilities/nftStorage';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import Transaction from 'arweave/node/lib/transaction';

const arweaveJwk = JSON.parse(process.env.ARWEAVE_JSON_JWK || '');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

/*
 * TODO authenticate requests coming from the (external) upload app
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
  await NextCors(request, response, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  const {
    query: { action },
  } = request;
  switch (action) {
    case 'CreateS3SignedUrl':
      await createS3SignedUrl(
        request.query.bucket as string,
        request.query.filename as string,
        response
      );
      break;
    case 'CopyFromS3toArweave':
      await copyFromS3toArweave(request.query.s3Path as string, response);
      break;
    case 'UploadNftMetadataToArweave':
      await uploadNftMetadataToArweave(request.body, response);
      break;
    case 'CreateNftStorageRequestToken':
      await createNftStorageRequestToken(response);
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
    case 'UpdateDefaultPrize':
      await updateDefaultPrize(request.body, response);
      break;
    case 'UpdateMetadataCid':
      await updateMetadataCid(request.body, response);
      break;
    default:
      response.status(400).json('Bad Request');
  }
  response.end();
}

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
 */
async function createS3SignedUrl(dropBucket: string, filename: string, response: NextApiResponse) {
  const region = 'us-east-2';
  aws.config.update({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_SAGE || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_SAGE || '',
    },
    signatureVersion: 'v4',
    region,
  });
  const s3 = new aws.S3();
  var params = {
    Bucket: `${process.env.S3_BUCKET}/${dropBucket}`,
    Key: filename,
    Expires: 60,
    ACL: 'public-read',
  };
  const uploadUrl = s3.getSignedUrl('putObject', params);
  const getUrl = `https://${process.env.S3_BUCKET}.s3.${region}.amazonaws.com/${dropBucket}/${filename}`;
  response.json({ uploadUrl, getUrl });
}

async function copyFromS3toArweave(s3Path: string, response: NextApiResponse) {
  const walletAddress = await arweave.wallets.jwkToAddress(arweaveJwk);
  const fileContent = await fetchFileContent(s3Path);
  const filename = s3Path.split('/').pop() as string;
  const tx = await sendArweaveTransaction(filename, fileContent, inferMimeType(s3Path), arweaveJwk);
  const balance = await arweave.wallets.getBalance(walletAddress);
  response.json({ id: tx.id, balance });
}

async function sendArweaveTransaction(
  filename: string,
  data: any,
  contentType: string,
  jwk: JWKInterface
): Promise<Transaction> {
  const transaction = await arweave.createTransaction({ data }, jwk);
  transaction.addTag('Content-Type', contentType);
  await arweave.transactions.sign(transaction, jwk);
  let uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    );
  }
  console.log(`sendArweaveTransaction() :: file ${filename} -> ${transaction.id}`);
  return transaction;
}

async function uploadNftMetadataToArweave(nftMetadataFiles: any, response: NextApiResponse) {
  var metadataType = 'application/json';
  for (const item of nftMetadataFiles) {
    const tx = await sendArweaveTransaction(item.filename, item.data, metadataType, arweaveJwk);
    item.txId = tx.id;
  }
  const manifest = createArweaveManifest(nftMetadataFiles);
  console.log(manifest);
  const manifestType = 'application/x.arweave-manifest+json';
  const tx = await sendArweaveTransaction('manifest', manifest, manifestType, arweaveJwk);
  const walletAddress = await arweave.wallets.jwkToAddress(arweaveJwk);
  const balance = await arweave.wallets.getBalance(walletAddress);
  response.json({ id: tx.id, balance });
}

/**
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

/**
 * https://github.com/nftstorage/ucan.storage#creating-a-request-token-to-upload-content
 */
async function createNftStorageRequestToken(response: NextApiResponse) {
  try {
    const token = await createUcanRequestToken();
    response.json({ token });
  } catch (e: any) {
    console.log(e);
    response.json({ error: e.message });
  }
}

async function insertDrop(data: any, response: NextApiResponse) {
  console.log('insertDrop()');
  try {
    var insertData = {
      data: {
        name: data.name,
        description: data.description || '',
        createdAt: new Date(),
        royaltyPercentage: toNumber(data.rltyPercent),
        tags: data.tags || '',
        bannerImageS3Path: data.bannerImageS3Path,
        metadataS3Path: '',
        dropMetadataCid: '',
        Artist: {
          connectOrCreate: {
            where: {
              walletAddress: data.artistWallet,
            },
            create: {
              walletAddress: data.artistWallet,
              role: Role.ARTIST,
            },
          },
        },
        PrimarySplitter: {
          create: {
            SplitterEntries: {
              createMany: {
                data: data.primarySalesSplitEntries,
              },
            },
          },
        },
        SecondarySplitter: {
          create: {
            SplitterEntries: {
              createMany: {
                data: data.royaltySplitEntries,
              },
            },
          },
        },
        Whitelist: null || {},
      },
    };
    /* TODO add whitelist feature
    if ("new" == data.whitelist) {
      insertData.data.Whitelist = {
        create: {
          name: data.whitelistNewEntryName,
          contractAddress: data.whitelistNewEntryToken,
        },
      };
    }
    */
    var record = await prisma.drop.create(insertData);
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
        Drop: {
          connect: {
            id: Number(data.dropId),
          },
        },
        minimumPrice: data.minPrice,
        startTime: new Date(Number(data.startDate) * 1000),
        endTime: new Date(Number(data.endDate) * 1000),
        Nft: {
          create: {
            name: data.name,
            description: data.description || '',
            tags: data.tags || '',
            rarity: '',
            numberOfEditions: 1,
            isVideo: 'true' == data.isVideo,
            ipfsPath: data.ipfsPath,
            s3Path: data.s3Path,
          },
        },
      },
    });
    response.json({ auctionId: record.id, nftId: record.id });
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
        tags: data.tags || '',
        rarity: data.rarity || '',
        numberOfEditions: toNumber(data.numberOfEditions),
        isVideo: 'true' == data.isVideo,
        ipfsPath: data.ipfsPath,
        s3Path: data.s3Path,
        Auction: null || {},
        Lottery: null || {},
      },
    };
    // NFT either belongs to an Auction or to a Lottery
    if (data.auctionId) {
      insertData.data.Auction = {
        connect: {
          id: data.auctionId,
        },
      };
    } else {
      insertData.data.Lottery = {
        connect: {
          id: data.drawingId,
        },
      };
    }
    var record = await prisma.nft.create(insertData);
    response.json({ nftId: record.id });
  } catch (e: any) {
    console.log(e);
    response.json({ error: e.message });
  }
}

async function insertDrawing(data: any, response: NextApiResponse) {
  console.log('insertDrawing()');
  try {
    var record = await prisma.lottery.create({
      data: {
        dropId: Number(data.dropId),
        costPerTicketTokens: toNumber(data.ticketCostCoins),
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

async function updateDefaultPrize(data: any, response: NextApiResponse) {
  console.log('updateDefaultPrize()');
  try {
    await prisma.lottery.update({
      where: {
        id: Number(data.drawingId),
      },
      data: {
        defaultPrizeId: Number(data.nftId),
      },
    });
    response.json({ success: true });
  } catch (e: any) {
    console.log(e);
    response.json({ error: e.message });
  }
}

async function updateMetadataCid(data: any, response: NextApiResponse) {
  console.log('updateMetadataCid()');
  try {
    await prisma.drop.update({
      where: {
        id: Number(data.dropId),
      },
      data: {
        dropMetadataCid: data.dropMetadataCid,
      },
    });
    response.json({ success: true });
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
      return 'video/mpeg';
    case 'gif':
      return 'image/gif';
    case 'png':
      return 'image/png';
  }
  return 'image/jpeg';
}

export default handler;
