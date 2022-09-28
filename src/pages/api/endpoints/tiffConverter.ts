import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { uploadBufferToS3 } from '@/utilities/awsS3-server';

const OPTIMIZED_JPEG_WIDTH = 487;
const OPTIMIZED_BUCKET_FOLDER = 'optimized';

/**
 * Receives an s3Path for a TIFF file (by POST), converts it to JPEG, uploads the JPEG (also to S3),
 * and returns the path (URL) for the new optimized file.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'POST') {
    res.status(401).end();
    return;
  }
  try {
    const { s3PathTiff } = req.body;
    if (!s3PathTiff) {
      res.status(401).end();
      return;
    }
    const response = await fetch(s3PathTiff);
    const tiffFileContent = new Uint8Array(await response.arrayBuffer());
    const jpegBuffer: Buffer = await sharp(tiffFileContent)
      .jpeg()
      .resize(OPTIMIZED_JPEG_WIDTH)
      .toBuffer();
    const filename = `${Date.now().toString()}.jpg`;
    const s3PathOptimized = await uploadBufferToS3(
      OPTIMIZED_BUCKET_FOLDER,
      filename,
      'image/jpeg',
      jpegBuffer
    );
    res.json({ s3PathOptimized });
  } catch (e: any) {
    console.log(e);
    res.json({ s3PathOptimized: null });
  }
  res.end();
}
