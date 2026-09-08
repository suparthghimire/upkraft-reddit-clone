import Link from "next/link";
import { revalidatePath } from "next/cache";
import { POSTS } from "../data";

import {Input} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function CreateNewPost() {
  async function addNewPost(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    POSTS.push({
      id: POSTS.length + 1,
      title,
      description,
    });
    revalidatePath("/post");
  }
  return (
    <>
      <form action={addNewPost} className="flex flex-col gap-3 w-full">
        <Link className="text-blue-500 underline" href="/post">
          Go Back
        </Link>
        <h1 className="text-xl">Create new post</h1>
        <div className ="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter your title"
            required
          />
        </div>
        <div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea
    id="description"
    name="description"
    placeholder="Write your post..."
    required
  />
</div>
        <Button type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}

export default CreateNewPost;
