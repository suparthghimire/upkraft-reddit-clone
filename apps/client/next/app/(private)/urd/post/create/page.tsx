'use client';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptedFileMimeTypes, PostCreateInput, postCreateSchema } from '@reddit-clone/shared';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { createNewPost } from '@/lib/api/post.api';
import { toast } from '@/components/ui/toast';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { handleCreateUploadUrl } from '@/lib/api/s3.api';
import axios from 'axios';
import { Attachments } from './attachments';

function CreateNewPost() {
  const { mutateAsync: triggerCreate, isPending } = useMutation({
    mutationFn: createNewPost,
    mutationKey: ['createNewPost'],
  });

  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: [
      {
        accept: {
          'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        },
      },
    ],
    onDrop: (acceptedFiles) => {
      // Do something with the files, e.g. upload to a server
      setFiles((prevFiles) =>
        prevFiles.length <= 5 ? [...prevFiles, ...acceptedFiles] : prevFiles,
      );
    },
  });

  function handleFileRemove(fileIdx: number) {
    setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== fileIdx));
  }

  const { mutateAsync: triggerCreateUploadUrl, isPending: isCreatingUploadUrl } = useMutation({
    mutationFn: handleCreateUploadUrl,
    mutationKey: ['createUploadUrl'],
  });

  async function createWithFileUpload(data: PostCreateInput) {
    if (files.length === 0) {
      return toast.promise(triggerCreate(data), {
        loading: 'Creating post...',
        success: 'Post created successfully!',
        error: 'Failed to create post.',
      });
    }

    // Else, first generate upload urls and upload the files one by one
    const response = await Promise.allSettled(
      files.map((file) => {
        return triggerCreateUploadUrl({
          fileName: file.name,
          contentType: file.type,
        });
      }),
    );

    const successResponses = response
      .filter((res) => res.status === 'fulfilled')
      .map((item) => {
        return item.value;
      });

    const imageKeys = successResponses.map((res) => res.data?.key).filter(Boolean) as string[];

    const uploadUrls = successResponses
      .map((res) => res.data?.uploadUrl)
      .filter(Boolean) as string[];

    // For each upload url. upload the file
    for (let i = 0; i < uploadUrls.length; i++) {
      await axios.put(uploadUrls[i], files[i], {
        headers: {
          'Content-Type': files[i].type,
        },
      });
    }

    return toast.promise(
      triggerCreate({
        ...data,
        imageKeys: imageKeys,
      }),
      {
        loading: 'Creating post...',
        success: 'Post created successfully!',
        error: 'Failed to create post.',
      },
    );
  }

  function handleCreatePost(data: PostCreateInput) {
    return toast.promise(createWithFileUpload(data), {
      loading: 'Creating post...',
      success: 'Post created successfully!',
      error: 'Failed to create post.',
    });
  }

  const form = useForm<PostCreateInput>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      content: '',
      title: '',
    },
  });

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            New post
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Share something with the community
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Start a conversation, ask a question, or share something worth discussing.
          </p>
        </header>

        <FormProvider {...form}>
          <form
            className="rounded-xl border bg-card p-5 shadow-sm sm:p-7"
            onSubmit={form.handleSubmit(handleCreatePost)}
          >
            <FieldGroup className="gap-6">
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-medium" htmlFor="post-title">
                      Title
                    </FieldLabel>
                    <Input
                      className="h-11 bg-background px-3 text-sm md:text-sm"
                      id="post-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Give your post a clear title"
                      autoComplete="off"
                      autoFocus
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-medium" htmlFor="post-content">
                      Body
                    </FieldLabel>
                    <Textarea
                      className="min-h-52 resize-y bg-background px-3 py-3 text-sm leading-6 md:text-sm"
                      id="post-content"
                      aria-invalid={fieldState.invalid}
                      placeholder="Write your post here..."
                      autoComplete="off"
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div
                {...getRootProps()}
                className="h-15.25 px-1 bg-card border border-border border-dashed rounded-xl flex items-center justify-center"
              >
                <input {...getInputProps()} />
                {files.length <= 0 ? (
                  <p>Drag drop some files here, or click to select files</p>
                ) : null}

                {files.length > 0 ? (
                  <Attachments onFileRemove={handleFileRemove} files={files} />
                ) : null}
              </div>
            </FieldGroup>

            <div className="mt-6 flex justify-end border-t pt-5">
              <Button loading={isPending} type="submit">
                Create post
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}

export default CreateNewPost;
