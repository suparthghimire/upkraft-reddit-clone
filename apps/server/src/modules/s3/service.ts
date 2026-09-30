import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../../lib/env.schema.js';
import { CustomError } from '../../http/error/customError.js';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

export function getS3Client() {
  return s3Client;
}

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function createPresignedUrl(args: {
  userId: number;
  fileName: string;
  contentType: string;
}) {
  const { contentType, userId, fileName } = args;

  if (!allowedTypes.has(contentType)) {
    throw new CustomError(
      `Invalid content type. Allowed types are: ${Array.from(allowedTypes).join(', ')}`,
      403,
    );
  }

  const extension = contentType.split('/')[1];
  const key = `uploads/${userId}.${fileName}.${randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 5 * 60 * 60,
  });

  return { uploadUrl, key };
}

export async function generatePresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: 'inline',
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 60,
  });

  return presignedUrl;
}
