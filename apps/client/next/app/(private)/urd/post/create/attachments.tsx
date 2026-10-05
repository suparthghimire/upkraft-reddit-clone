'use client';

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import { X } from 'lucide-react';

type AttachmentsProps = {
  files: File[];
  onFileRemove: (fileIdx: number) => void;
};

export function Attachments({ files, onFileRemove }: AttachmentsProps) {
  return (
    <AttachmentGroup className="w-full">
      {files.map((file, idx) => {
        const src = URL.createObjectURL(file);

        return (
          <Attachment key={file.name} className="group relative">
            <AttachmentMedia variant="image">
              <img src={src} alt={file.name} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{file.name}</AttachmentTitle>
              <AttachmentDescription>{(file.size / 1024).toFixed(2)} KB</AttachmentDescription>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="absolute -right-2 -top-2 hidden size-5 cursor-pointer place-items-center rounded-full border border-input bg-card shadow-sm group-hover:grid"
                onClick={(event) => {
                  event.stopPropagation();
                  onFileRemove(idx);
                }}
              >
                <X className="size-3" />
              </button>
            </AttachmentContent>
          </Attachment>
        );
      })}
    </AttachmentGroup>
  );
}
