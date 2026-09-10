import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { POSTS } from '../data';

function CreateNewPost() {
  async function addNewPost(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    POSTS.push({
      id: String(POSTS.length + 1),
      title,
      content,
      images: [],
      createdBy: {
        id: 'local-user',
        name: 'Local User',
      },
    });
    revalidatePath('/post');
  }
  return (
    <>
      <form action={addNewPost} className="flex flex-col gap-3 w-full">
        <Link className="text-blue-500 underline" href="/post">
          Go Back
        </Link>
        <h1 className="text-xl">Create new post</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Enter your title</label>
          <input
            id="title"
            name="title"
            className="bg-foreground text-background p-2 rounded-lg outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="body">Enter your body</label>
          <textarea
            id="body"
            name="content"
            className="bg-foreground text-background p-2 rounded-lg outline-none"
          />
        </div>
        <button className="px-4 py-2 cursor-pointer bg-emerald-500 text-emerald-950 rounded-lg w-max">
          Submit
        </button>
      </form>
    </>
  );
}

export default CreateNewPost;
