import React, { PropsWithChildren } from 'react';

function AboutPageLayout(props: PropsWithChildren) {
  return (
    <div>
      this is about page layout
      {props.children}
    </div>
  );
}

export default AboutPageLayout;
