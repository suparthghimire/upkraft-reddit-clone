import Link from 'next/link';
import { POSTS } from '../../data';
import { revalidatePath } from 'next/cache';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function EditPostPage(props: Props) {
  const params = await props.params;

  const post = POSTS.find((post) => post.id === params.id);

  async function updatePost(formData: FormData) {
    'use server';
    const title = formData.get('title');
    const content = formData.get('content');

    const postIndex = POSTS.findIndex((p) => p.id === params.id);

    if (postIndex === -1) return;

    POSTS[postIndex].title = title as string;
    POSTS[postIndex].content = content as string;

    revalidatePath('/posts/' + params.id + '/edit');
  }

  if (!post) return <>Post not found</>;

  return (
    <form action={updatePost} className="flex flex-col gap-3 w-full">
      <Link className="text-blue-500 underline" href="/post">
        Go Back
      </Link>
      <h1 className="text-xl">Update post</h1>
      <div className="flex flex-col gap-1">
        <label htmlFor="title">Enter your title</label>
        <input
          id="title"
          defaultValue={post.title}
          name="title"
          className="bg-foreground text-background p-2 rounded-lg outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="body">Enter your body</label>
        <textarea
          id="body"
          name="content"
          defaultValue={post.content}
          className="bg-foreground text-background p-2 rounded-lg outline-none"
        />
      </div>
      <button className="px-4 py-2 cursor-pointer bg-emerald-500 text-emerald-950 rounded-lg w-max">
        Submit
      </button>
    </form>
  );
}

export default EditPostPage;
