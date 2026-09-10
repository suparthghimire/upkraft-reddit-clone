import React from 'react';
import { POSTS } from '../data';
import Link from 'next/link';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function SinglePostPage(props: Props) {
  const params = await props.params;

  const post = POSTS.find((post) => post.id === params.id);

  if (!post) return <>Post not found</>;

  return (
    <div className="flex flex-col gap-4">
      <Link href="/post" className="text-blue-500 underline">
        Go Back
      </Link>
      <div className="flex justify-between gap-2">
        <h2 className="text-xl">{post.title}</h2>
        <Link
          href={`/post/${post.id}/edit`}
          className="text-xs p-2 rounded-lg bg-foreground text-background"
        >
          Edit ✏️
        </Link>
      </div>

      <p className="text-xs">{post.content}</p>
    </div>
  );
}

export default SinglePostPage;
