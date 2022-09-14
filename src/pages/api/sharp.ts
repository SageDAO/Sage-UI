import { NextApiRequest, NextApiResponse } from 'next';

const sharp = require('sharp');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  
  
  const semiTransparentRedPng = await sharp({
    create: {
      width: 48,
      height: 48,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    }
  })
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/jpeg');
  res.send(semiTransparentRedPng);
};

