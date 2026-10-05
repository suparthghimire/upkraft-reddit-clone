import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import type { AcceptedFileMimeTypes } from '@reddit-clone/shared';
import crypto from 'crypto';
import { env } from '../../lib/env.schema.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './client.js';

export async function getUploadUrl(args: {
  fileName: string;
  contentType: AcceptedFileMimeTypes;
  userId: number;
}) {
  const { fileName, contentType, userId } = args;

  // image/jpeg -> jpeg
  const extension = contentType.split('/')[1];

  const randomId = crypto.randomUUID();

  // This key is same as the path store in s3
  const key = `uploads/${userId}/${fileName}__${randomId}.${extension}`;

  // Get the url to upload a file in s3
  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // Create the url to upload the file
  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 15 * 60, // 15min
  });

  return {
    key,
    uploadUrl,
  };
}

export async function getPresignedUrlFromKey(key: string) {
  const command = new GetObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: 'inline',
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 15 * 60, // 15min
  });
  return presignedUrl;
}
