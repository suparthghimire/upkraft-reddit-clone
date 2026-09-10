import "../../../styles/layout/nav.css";
import Button from "../../core/button";

export default function Nav() {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Button>Home</Button>
        </li>
        <li>
          <Button>About</Button>
        </li>
        <li>
          <Button>Contact</Button>
        </li>
      </ul>
    </nav>
  );
}
