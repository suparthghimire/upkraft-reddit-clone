import Link from 'next/link';
import { POSTS } from './data';

function Posts() {
  return (
    <>
      {POSTS.length <= 0 ? (
        <EmptyContent />
      ) : (
        <Link className="text-blue-500 underline" href="/post/create">
          Create New Post
        </Link>
      )}

      {POSTS.map((post) => (
        <div
          key={post.id}
          className="flex items-center justify-between gap-2 bg-foreground/95 p-4 rounded-lg hover:bg-foreground/90"
        >
          <div className="flex flex-col gap-1 w-max hover:underline text-background">
            <Link href={`/post/${post.id}`} className="cursor-pointer">
              <h2 className="text-lg text-background">{post.title}</h2>
              <p className="text-xs text-background line-clamp-2 text-ellipsis">{post.content}</p>
            </Link>
          </div>
          <button className="p-2 rounded-lg cursor-pointer hover:bg-red-100 text-xs bg-red-200 border border-red-500 text-red-500 ">
            🗑️ Delete
          </button>
        </div>
      ))}
    </>
  );
}

function EmptyContent() {
  return (
    <p>
      Please add posts from{' '}
      <Link className="text-blue-500 underline" href="/post/create">
        here
      </Link>
    </p>
  );
}

export default Posts;
