import{
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";


import Link from "next/link";
import { POSTS } from "./data";
import {revalidatePath} from "next/cache";  

function Posts() {
  async function deletePost(postId: string) {
    "use server";

    const postIndex = POSTS.findIndex((post) => post.id === Number(postId));

    if(postIndex === -1) {
      throw new Error("Post not found");
    }

    POSTS.splice(postIndex, 1);
    revalidatePath("/post");
  }
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
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/post/${post.id}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {post.description}
              </p>
  
      
          <form action={deletePost.bind(null, post.id.toString())}>
            <Button type="submit" variant="destructive" size="sm">
              🗑️ Delete
            </Button>
          </form>
          </CardContent>
          </Card>
        </div>
      ))}
    </>
  );
}

function EmptyContent() {
  return (
    <p>
      Please add posts from{" "}
      <Link className="text-blue-500 underline" href="/post/create">
        here
      </Link>
    </p>
  );
}

export default Posts;
