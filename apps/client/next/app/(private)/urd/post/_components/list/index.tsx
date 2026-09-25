'use client';

import type { Post } from '@/lib/types/post.types';
import { Sparkles } from 'lucide-react';
import { ApiResponse, QueryParamSchema } from '@reddit-clone/shared';
import PostsToolbar from './posts-toolbar';
import EmptyPosts from './empty-posts';
import SinglePostCard from './single-post-card';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts } from '@/lib/api/post.api';
import { queryKeys } from '@/lib/react-query/query-mutation-keys';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDebounceValue } from 'usehooks-ts';

function PostList({
  postsResponse,
  count,
}: {
  postsResponse: ApiResponse<Post[]>;
  count?: number;
}) {
  const searchParams = useSearchParams();

  const queryParamObj = useCallback((): QueryParamSchema => {
    const params: QueryParamSchema = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const [debouncedQueryParamObj] = useDebounceValue(queryParamObj(), 300);

  const postsQuery = useQuery({
    queryKey: [queryKeys.getPosts(debouncedQueryParamObj)],
    queryFn: () => getAllPosts(debouncedQueryParamObj),
    initialData: postsResponse,
  });

  const posts = postsQuery.data?.data ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ee5a2f]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Community feed
          </div>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-5xl lg:text-[3.5rem]">
            The good stuff, all in one place.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-black/55">
            Ideas, questions, and small discoveries from people who like to share what they know.
          </p>

          <div className="mt-6 hidden border-t border-black/10 pt-5 lg:block">
            <p className="text-2xl font-semibold tracking-[-0.04em]">{count}</p>
            <p className="mt-0.5 text-xs text-black/45">
              {count === 1 ? 'post' : 'posts'} in total
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <PostsToolbar />

          {posts.length === 0 ? (
            <EmptyPosts />
          ) : (
            <div className="space-y-3">
              {posts.map((post, index) => {
                return <SinglePostCard key={post.id} index={index} post={post} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostList;
