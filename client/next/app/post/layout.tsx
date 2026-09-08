import React, { PropsWithChildren } from "react";

function PostLayout(props: PropsWithChildren) {
  return <main className="mx-auto w-full max-w-2xl px-4 py-8">{props.children}</main>;
}

export default PostLayout;
