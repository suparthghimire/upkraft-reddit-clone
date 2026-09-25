import { getAllPosts } from '@/lib/api/post.api';
import PostList from './(private)/urd/post/_components/list';

export default async function Home() {
  const postsResponse = await getAllPosts({ limit: 10 });

  if (postsResponse.data)
    return <PostList count={postsResponse.count} postsResponse={postsResponse} />;

  return null;
}
