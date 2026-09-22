'use client';

import type { Post } from '@/lib/types/post.types';
import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowLeft,
  Bookmark,
  Check,
  Clock3,
  Edit3,
  Feather,
  Plus,
  Share2,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { APP_ROUTES } from '@/lib/app-routes';
import { useMutation } from '@tanstack/react-query';
import { useGetUserAPI } from '@/hooks/api/useUser';
import { toast } from '@/components/ui/toast';
import { CleanedUser } from '@reddit-clone/shared';
import { voteOnPost } from '@/lib/api/post.api';
import CommentsSection from '@/app/(private)/urd/post/_components/comments-section';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

function formatDate(value: Date | string) {
  const date = toDate(value);

  return Number.isNaN(date.getTime()) ? 'Recently' : dateFormatter.format(date);
}

function getReadingTime(content: string) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function PostView({ post }: { post: Post }) {
  const [isSaved, setIsSaved] = useState(false);
  const [wasCopied, setWasCopied] = useState(false);
  const { data: currentUser } = useGetUserAPI();

  const wasEdited = toDate(post.updated_at).getTime() !== toDate(post.created_at).getTime();

  async function sharePost() {
    const shareData = { title: post.title, url: window.location.href };

    if (navigator.share) {
      toast.promise(navigator.share(shareData), {
        success: 'Done!',
        error: 'Failed to share the post.',
        loading: 'Processing...',
      });
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setWasCopied(true);
    } catch {
      setWasCopied(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href={APP_ROUTES.HOME}
        className="group inline-flex items-center gap-2 rounded-full text-xs font-semibold text-black/50 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/40"
      >
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to the feed
      </Link>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-7">
        <div className="min-w-0 space-y-5">
          <article className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_18px_60px_rgba(42,37,28,0.07)]">
            <header className="border-b border-black/7 px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
              <div className="flex items-center gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#ffede7] text-sm font-bold text-[#c43f18]">
                  {post.user.name.trim().charAt(0).toUpperCase() || 'U'}
                </span>
                <div>
                  <p className="text-xs font-semibold text-black/65">{post.user.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-black/42">
                    <time dateTime={toDate(post.created_at).toISOString()}>
                      {formatDate(post.created_at)}
                    </time>
                    <span className="size-0.5 rounded-full bg-black/25" aria-hidden="true" />
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3" aria-hidden="true" />
                      {getReadingTime(post.content)} min read
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-balance sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {wasEdited ? (
                <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-medium text-black/38">
                  <Edit3 className="size-3" aria-hidden="true" />
                  Last edited {formatDate(post.updated_at)}
                </p>
              ) : null}
            </header>

            <div className="px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
              <div className="max-w-3xl whitespace-pre-wrap wrap-break-word text-[15px] leading-8 text-black/70 sm:text-base">
                {post.content}
              </div>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/7 bg-[#fbfaf7] px-5 py-4 sm:px-9 lg:px-12">
              {currentUser?.data && <PostVoteActions post={post} currentUser={currentUser.data} />}

              <div className="flex items-center justify-end gap-1.5">
                {currentUser?.data && (
                  <button
                    type="button"
                    onClick={() => setIsSaved((currentValue) => !currentValue)}
                    className={`inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/40 ${
                      isSaved
                        ? 'bg-[#fff0eb] text-[#c64220]'
                        : 'text-black/50 hover:bg-black/5 hover:text-black/75'
                    }`}
                    aria-pressed={isSaved}
                  >
                    <Bookmark
                      className={`size-3.5 ${isSaved ? 'fill-current' : ''}`}
                      aria-hidden="true"
                    />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={sharePost}
                  className="inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold text-black/50 transition hover:bg-black/5 hover:text-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/40"
                >
                  {wasCopied ? (
                    <Check className="size-3.5 text-[#17674f]" aria-hidden="true" />
                  ) : (
                    <Share2 className="size-3.5" aria-hidden="true" />
                  )}
                  {wasCopied ? 'Copied' : 'Share'}
                </button>
              </div>
            </footer>
          </article>

          <CommentsSection postId={post.id} />
        </div>

        <aside className="space-y-3 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ee5a2f]">
              At a glance
            </p>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-4 border-b border-black/6 pb-3">
                <dt className="text-xs text-black/45">Published</dt>
                <dd className="text-right text-xs font-semibold">{formatDate(post.created_at)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-xs text-black/45">Reading time</dt>
                <dd className="text-right text-xs font-semibold">
                  {getReadingTime(post.content)} min
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ee5a2f]">
              Contributor
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#ece9ff] text-sm font-bold text-[#5846a8]">
                {post.user.name.trim().charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#20211f]">{post.user.name}</p>
                <p className="mt-0.5 text-xs text-black/45">
                  Member since {formatDate(post.user.created_at)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-black/6 pt-3 text-xs text-black/45">
              <UserRound className="size-3.5" aria-hidden="true" />
              Community contributor
            </div>
          </div>

          <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <div className="grid size-9 place-items-center rounded-xl bg-[#e6f3ee] text-[#17674f]">
              <Feather className="size-4" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-base font-semibold tracking-[-0.02em]">
              Have something to add?
            </h2>
            <p className="mt-2 text-xs leading-5 text-black/48">
              Keep the ideas moving. Share a question, lesson, or discovery of your own.
            </p>
            <Link
              href={APP_ROUTES.POST.CREATE}
              className="mt-5 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#20211f] px-4 text-xs font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/50"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Create a post
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PostVoteActions(props: { currentUser: CleanedUser; post: Post }) {
  const userVotes = props.post.votes.filter((vote) => vote.user_id === props.currentUser.id);

  const [voteCount, setVoteCount] = useState({
    upvote: {
      status: userVotes.some((vote) => vote.vote_type === 'upvote'),
      count: props.post.total_upvotes,
    },
    downvote: {
      status: userVotes.some((vote) => vote.vote_type === 'downvote'),
      count: props.post.total_downvotes,
    },
  });

  const { mutateAsync: castVote } = useMutation({
    mutationFn: voteOnPost,
    mutationKey: ['voteOnPost'],
  });

  function handleVote(voteType: 'upvote' | 'downvote') {
    setVoteCount((prev) => {
      const upvoteChangeValue = prev[voteType].status === true ? -1 : 1;
      return {
        ...prev,
        [voteType]: {
          status: !prev[voteType].status,
          count: prev[voteType].count + upvoteChangeValue,
        },
      };
    });
    void castVote({ postId: props.post.id, voteType: voteType });
  }

  return (
    <div
      className="inline-flex items-center rounded-full bg-[#eeece7] p-0.5"
      aria-label="Post voting"
    >
      <VoteButton
        onClick={() => handleVote('upvote')}
        voteType="upvote"
        count={voteCount.upvote.count}
      />

      <VoteButton
        onClick={() => handleVote('downvote')}
        voteType="downvote"
        count={voteCount.downvote.count}
      />
    </div>
  );
}

function VoteButton(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    count: number;
    voteType: 'upvote' | 'downvote';
  },
) {
  const { voteType, count, ...rest } = props;
  return (
    <button
      type="button"
      className={`flex items-center size-8 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6558c7]/40 ${'text-black/45 hover:bg-white hover:text-[#6558c7]'}`}
      aria-label={voteType === 'upvote' ? 'Upvote post' : 'Downvote post'}
      {...rest}
    >
      {voteType === 'upvote' ? (
        <ArrowBigUp className="size-4" aria-hidden="true" />
      ) : (
        <ArrowBigDown className="size-4" aria-hidden="true" />
      )}
      {count}
    </button>
  );
}

export default PostView;
