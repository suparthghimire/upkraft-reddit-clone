import { APP_ROUTES } from '@/lib/app-routes';
import { Post } from '@/lib/types/post.types';
import { formatDate, normalizeText, toDate } from '@reddit-clone/shared';
import Link from 'next/link';
import React from 'react';

const avatarStyles = [
  'bg-[#ffede7] text-[#c43f18]',
  'bg-[#e6f3ee] text-[#17674f]',
  'bg-[#ece9ff] text-[#5846a8]',
  'bg-[#fff1c7] text-[#8a5a00]',
];

function SinglePostCard({ post, index }: { post: Post; index: number }) {
  const wasEdited = toDate(post.updated_at).getTime() !== toDate(post.created_at).getTime();

  return (
    <article
      key={post.id}
      className="group relative overflow-hidden rounded-2xl border border-black/8 bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_18px_45px_rgba(42,37,28,0.08)] sm:p-5"
    >
      <div className="flex gap-3.5 sm:gap-4">
        <div
          className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${avatarStyles[index % avatarStyles.length]}`}
          aria-hidden="true"
        >
          {post.user.name.trim().charAt(0).toUpperCase() || 'U'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-black/42">
            <span className="text-black/65">{post.user.name}</span>
            <span className="size-0.5 rounded-full bg-black/25" aria-hidden="true" />
            <time dateTime={toDate(post.created_at).toISOString()}>
              {formatDate(post.created_at)}
            </time>
            {wasEdited ? (
              <>
                <span className="size-0.5 rounded-full bg-black/25" aria-hidden="true" />
                <span>Edited</span>
              </>
            ) : null}
          </div>

          <Link
            href={APP_ROUTES.POST.VIEW(post.slug)}
            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/40 focus-visible:ring-offset-4"
          >
            <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-[#20211f] transition-colors group-hover:text-[#c64220] sm:text-xl">
              {post.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/58">
              {normalizeText(post.content)}
            </p>
          </Link>

          {/* <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/6 pt-3">
                          <div
                            className="inline-flex items-center rounded-full bg-[#f3f2ee] p-0.5"
                            aria-label="Post voting"
                          >
                            <button
                              type="button"
                              // onClick={() => castVote(post.id, 1)}
                              className={`grid size-7 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/40 ${
                                upvoteCount > 0
                                  ? 'bg-[#ff6842] text-white shadow-sm'
                                  : 'text-black/45 hover:bg-white hover:text-[#e44e27]'
                              }`}
                              aria-label="Upvote post"
                              aria-pressed={upvoteCount > 0}
                            >
                              <ArrowBigUp className="size-4" aria-hidden="true" />
                            </button>
                            <span
                              className={`min-w-7 text-center text-xs font-bold tabular-nums ${
                                upvoteCount - downvoteCount === 0 ? 'text-black/55' : 'text-[#c64220]'
                              }`}
                              aria-label={`${upvoteCount - downvoteCount} votes`}
                            >
                              {upvoteCount - downvoteCount}
                            </span>
                            <button
                              type="button"
                              // onClick={() => castVote(post.id, -1)}
                              className={`grid size-7 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b5fd3]/40 ${
                                downvoteCount > 0
                                  ? 'bg-[#6558c7] text-white shadow-sm'
                                  : 'text-black/45 hover:bg-white hover:text-[#6558c7]'
                              }`}
                              aria-label="Downvote post"
                              aria-pressed={downvoteCount > 0}
                            >
                              <ArrowBigDown className="size-4" aria-hidden="true" />
                            </button>
                          </div>

                          <button
                            type="button"
                            //   onClick={() => toggleSaved(post.id)}
                            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/40 ${
                              isSaved
                                ? 'bg-[#fff0eb] text-[#c64220]'
                                : 'text-black/45 hover:bg-[#f3f2ee] hover:text-black/70'
                            }`}
                            aria-pressed={isSaved}
                          >
                            <Bookmark
                              className={`size-3.5 ${isSaved ? 'fill-current' : ''}`}
                              aria-hidden="true"
                            />
                            {isSaved ? 'Saved' : 'Save'}
                          </button>
                        </div> */}
        </div>
      </div>
    </article>
  );
}

export default SinglePostCard;
