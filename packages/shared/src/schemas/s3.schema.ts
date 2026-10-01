import z from 'zod';

export const acceptedFileMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;
export type AcceptedFileMimeTypes = (typeof acceptedFileMimeTypes)[number];

export const createUploadUrlSchema = z.object({
  fileName: z.string().min(1, 'Filename is required'),
  contentType: z.enum(acceptedFileMimeTypes),
});

export type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>;

export const createPresignedUrlSchema = z.object({
  key: z.string().min(1, 'Key is required'),
});

export type CreatePresignedUrlInput = z.infer<typeof createPresignedUrlSchema>;
