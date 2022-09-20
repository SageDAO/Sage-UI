import aws from 'aws-sdk';

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
 */
export function createS3SignedUrl(bucket: string, filename: string) {
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
    Bucket: `${process.env.S3_BUCKET}/${bucket}`,
    Key: filename,
    Expires: 60,
    ACL: 'public-read',
  };
  const uploadUrl = s3.getSignedUrl('putObject', params);
  const getUrl = `https://${process.env.S3_BUCKET}.s3.${region}.amazonaws.com/${bucket}/${filename}`;
  return { uploadUrl, getUrl };
}

export async function uploadBufferToS3Bucket(
  bucket: string,
  filename: string,
  fileType: string,
  buffer: Buffer
): Promise<string> {
  console.log(`uploadBufferToS3Bucket(bucket: ${bucket}, file: ${filename})`);
  let { uploadUrl, getUrl } = createS3SignedUrl(bucket, filename);
  console.log(`uploadBufferToS3Bucket() :: sending PUT request...`);
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': fileType },
    body: buffer,
  });
  console.log(`uploadBufferToS3Bucket() :: file uploaded to ${getUrl}`);
  return getUrl;
}
