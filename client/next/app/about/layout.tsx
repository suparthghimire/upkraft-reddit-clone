import React, { PropsWithChildren } from "react";

function AboutPageLayout(props: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-2xl p-6">
      this is about page layout
      {props.children}
    </div>
  );
}

export default AboutPageLayout;
