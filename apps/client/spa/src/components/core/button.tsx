import "../../styles/core/button.css";

function Button(props: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button className={`btn ${props.className ?? ""}`} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default Button;
