import { uploadBufferToS3Bucket } from '@/utilities/awsS3';
import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

const OPTIMIZED_WIDTH = 487;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const tiffBuffer: Buffer = Buffer.from(request.body);

  const jpegBuffer: Buffer = await sharp(tiffBuffer).jpeg().resize(OPTIMIZED_WIDTH).toBuffer();

  const bucket = 'optimized';
  const filename = `${Date.now().toString()}.jpg`;

  const s3PathOptimized = await uploadBufferToS3Bucket(bucket, filename, 'image/jpeg', jpegBuffer);

  response.json(s3PathOptimized);
};
