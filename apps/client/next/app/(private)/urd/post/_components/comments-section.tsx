'use client';

import { createComment, getCommentsForPost } from '@/lib/api/comment.api';
import { queryKeys } from '@/lib/react-query/query-mutation-keys';
import type { Comment } from '@/lib/types/comment.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, MessagesSquare, RefreshCw, Reply, Send, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  toDate,
  formatDate,
  getDateTime,
  createCommentSchema,
  type CreateCommentSchema,
} from '@reddit-clone/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

const avatarStyles = [
  'bg-[#ffede7] text-[#c43f18]',
  'bg-[#e6f3ee] text-[#17674f]',
  'bg-[#ece9ff] text-[#5846a8]',
  'bg-[#fff1c7] text-[#8a5a00]',
];

function CommentsSection({ postId }: { postId: number }) {
  const { data, isError, isFetching, isPending, refetch } = useQuery({
    queryKey: queryKeys.getComments(postId),
    queryFn: () => getCommentsForPost(postId),
  });

  const [replyToComment, setReplyToComment] = useState<Comment>();

  const comments = data?.data ?? [];
  return (
    <section
      className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_18px_60px_rgba(42,37,28,0.05)]"
      aria-labelledby="comments-heading"
    >
      <CommentSectionHeader
        commentCount={comments.length}
        isPending={isPending}
        isError={isError}
      />

      {isPending ? <CommentsLoading /> : null}

      {isError ? <CommentsError isFetching={isFetching} refetch={refetch} /> : null}

      {!isPending && !isError && comments.length === 0 ? <EmptyComments /> : null}

      {!isPending && !isError && comments.length > 0 ? (
        <CommentsList
          comments={comments}
          replyToComment={replyToComment}
          setReplyToComment={setReplyToComment}
        />
      ) : null}
      <CreateCommentInput
        postId={postId}
        replyToComment={replyToComment}
        clearReplyToComment={() => setReplyToComment(undefined)}
      />
    </section>
  );
}

function CommentsList({
  comments,
  replyToComment,
  setReplyToComment,
}: {
  comments: Comment[];
  replyToComment?: Comment;
  setReplyToComment: (comment?: Comment) => void;
}) {
  return (
    <ol className="divide-y divide-black/6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          setReplyToComment={setReplyToComment}
          replyToComment={replyToComment}
          comment={comment}
        />
      ))}
    </ol>
  );
}

function CommentItem({
  comment,
  replyToComment,
  setReplyToComment,
}: {
  comment: Comment;
  replyToComment?: Comment;
  setReplyToComment: (comment?: Comment) => void;
}) {
  const avatarStyle = avatarStyles[Math.abs(comment.user.id) % avatarStyles.length];
  const createdAt = toDate(comment.created_at);
  const updatedAt = toDate(comment.updated_at);
  const wasEdited =
    !Number.isNaN(createdAt.getTime()) &&
    !Number.isNaN(updatedAt.getTime()) &&
    updatedAt.getTime() !== createdAt.getTime();

  return (
    <li className="flex gap-3.5 px-5 py-5 sm:gap-4 sm:px-9 sm:py-6 lg:px-12">
      <div
        className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${avatarStyle}`}
        aria-hidden="true"
      >
        {comment.user.name.trim().charAt(0).toUpperCase() || 'U'}
      </div>

      <article className="min-w-0 flex-1" aria-label={`Comment by ${comment.user.name}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-black/42">
          <span className="text-black/65">{comment.user.name}</span>
          <span className="size-0.5 rounded-full bg-black/25" aria-hidden="true" />
          <time dateTime={getDateTime(comment.created_at)}>{formatDate(comment.created_at)}</time>
          {wasEdited ? (
            <>
              <span className="size-0.5 rounded-full bg-black/25" aria-hidden="true" />
              <span>Edited</span>
            </>
          ) : null}
          <Button onClick={() => setReplyToComment(comment)} variant="ghost" size="icon">
            <Reply />
          </Button>
        </div>

        <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-black/68">
          {comment.text}
        </p>

        <div>
          <CommentsList
            comments={comment.childComments}
            replyToComment={replyToComment}
            setReplyToComment={setReplyToComment}
          />
        </div>
      </article>
    </li>
  );
}

function CommentsLoading() {
  return (
    <div className="divide-y divide-black/6" role="status" aria-label="Loading comments">
      {[0, 1].map((item) => (
        <div key={item} className="flex animate-pulse gap-4 px-5 py-5 sm:px-9 sm:py-6 lg:px-12">
          <div className="size-10 shrink-0 rounded-xl bg-black/7" />
          <div className="flex-1 pt-1">
            <div className="h-2.5 w-36 rounded-full bg-black/8" />
            <div className="mt-4 h-3 w-full rounded-full bg-black/6" />
            <div className="mt-2 h-3 w-3/4 rounded-full bg-black/6" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading comments</span>
    </div>
  );
}

function CommentsError(props: { refetch: VoidFunction; isFetching: boolean }) {
  const { isFetching, refetch } = props;
  return (
    <div
      className="flex flex-col items-center px-5 py-12 text-center sm:px-9 lg:px-12"
      role="alert"
    >
      <span className="grid size-11 place-items-center rounded-2xl bg-[#fff0eb] text-[#c64220]">
        <MessageCircle className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">Comments couldn&apos;t be loaded</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-black/48">
        Something went wrong while loading the conversation. Please try again.
      </p>
      <button
        type="button"
        onClick={() => void refetch()}
        disabled={isFetching}
        className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#20211f] px-4 text-xs font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/50 disabled:pointer-events-none disabled:opacity-50"
      >
        <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}

function EmptyComments() {
  return (
    <div className="flex flex-col items-center px-5 py-12 text-center sm:px-9 lg:px-12">
      <span className="grid size-11 place-items-center rounded-2xl bg-[#f3f2ee] text-black/45">
        <MessageCircle className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">No comments yet</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-black/48">
        This conversation is still waiting for its first comment.
      </p>
    </div>
  );
}

function CommentSectionHeader(props: {
  isPending: boolean;
  isError: boolean;
  commentCount: number;
}) {
  const { commentCount, isError, isPending } = props;
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/7 px-5 py-5 sm:px-9 lg:px-12">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-[#e6f3ee] text-[#17674f]">
          <MessagesSquare className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="comments-heading" className="text-base font-semibold tracking-[-0.02em]">
            Comments
          </h2>
          {!isPending && !isError ? (
            <p className="mt-0.5 text-[11px] text-black/42">
              {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function CreateCommentInput(props: {
  postId: number;
  replyToComment?: Comment;
  clearReplyToComment: VoidFunction;
}) {
  const form = useForm<CreateCommentSchema>({
    defaultValues: {
      text: '',
      parentCommentId: props.replyToComment?.id ?? undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(createCommentSchema),
  });

  const { setValue } = form;

  const { mutateAsync: createCommentMutation, isPending } = useMutation({
    mutationFn: createComment,
    mutationKey: ['createComment'],
  });

  const queryClient = useQueryClient();

  async function submitWithQueryClean(values: CreateCommentSchema) {
    const res = await createCommentMutation({ payload: values, postId: props.postId });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.getComments(props.postId),
    });

    return res;
  }

  function onSubmit(values: CreateCommentSchema) {
    form.reset();
    toast.promise(submitWithQueryClean(values), {
      loading: 'Creating comment...',
      success: () => {
        return 'Comment created!';
      },
      error: 'Failed to create comment.',
    });
  }

  useEffect(() => {
    setValue('parentCommentId', props.replyToComment?.id ?? undefined);
  }, [props.replyToComment, setValue]);

  return (
    <form
      className="border-b border-black/7 bg-[#fbfaf7] px-5 py-5 sm:px-9 sm:py-6 lg:px-12"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="text"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-semibold text-black/65" htmlFor="comment-text">
                Add a comment
              </FieldLabel>
              {props.replyToComment && (
                <Badge>
                  Replying to {props.replyToComment.user.name}
                  <Button size="icon-sm" className="p-0" onClick={props.clearReplyToComment}>
                    <X />
                  </Button>
                </Badge>
              )}
            </div>
            <Textarea
              {...field}
              id="comment-text"
              className="min-h-24 resize-none rounded-2xl border-black/10 bg-white px-4 py-3 text-sm leading-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] placeholder:text-black/35 focus-visible:border-[#ee5a2f]/50 focus-visible:ring-[#ee5a2f]/10 md:text-sm"
              placeholder="Share what you think..."
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : (
              <FieldDescription>Keep it thoughtful and relevant to the post.</FieldDescription>
            )}
          </Field>
        )}
      />
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          className="h-9 rounded-full px-4 text-black/50"
          disabled={!form.formState.isDirty}
          onClick={() => form.reset()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-9 rounded-full bg-[#20211f] px-4 text-white hover:bg-black"
          disabled={!form.formState.isValid}
          loading={isPending}
        >
          <Send className="size-3.5" aria-hidden="true" />
          Comment
        </Button>
      </div>
    </form>
  );
}

export default CommentsSection;
