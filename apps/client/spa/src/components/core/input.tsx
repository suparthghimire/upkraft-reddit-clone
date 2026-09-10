import React from "react";
import "../../styles/core/input.css";

function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) {
  return <input className="input" {...props} />;
}

export default Input;
