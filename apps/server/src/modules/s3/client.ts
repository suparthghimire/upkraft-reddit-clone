import { S3Client } from '@aws-sdk/client-s3';
import { env } from '../../lib/env.schema.js';

export const s3Client = new S3Client({
  region: env.AWS_REGION,
  requestChecksumCalculation: 'WHEN_REQUIRED',
});
