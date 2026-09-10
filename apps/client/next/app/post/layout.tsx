import React, { PropsWithChildren } from 'react';

function PostLayout(props: PropsWithChildren) {
  return <main className="max-w-xl w-full mx-auto p-10">{props.children}</main>;
}

export default PostLayout;
