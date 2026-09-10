import { type PropsWithChildren } from "react";
import { Link } from "react-router-dom";

function RootLayout(props: PropsWithChildren) {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <div>{props.children}</div>
    </>
  );
}

export default RootLayout;
