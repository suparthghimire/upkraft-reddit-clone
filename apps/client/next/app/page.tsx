
import type {ApiResponse} from '@reddit-clone/shared';
import {type PostResponse} from '@reddit-clone/shared';
import PostList from '@/components/ui/PostList';

//Home page component



export default async function Home() {
  const PostsResponse: ApiResponse<PostResponse[] | null> = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_ENDPOINT}/v1/post`,
    {
      cache: 'no-store',
    }
  ).then((res) => res.json());
  return (<>
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Posts</h1>
      <PostList posts={PostsResponse.data ?? []} />
    </div>
  </>);
}
