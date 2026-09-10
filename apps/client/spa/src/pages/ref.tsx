import { useRef } from "react";
import Input from "../components/core/input";
import Button from "../components/core/button";

function Refs() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label htmlFor="Name">Name</label>
        <Input placeholder="Enter your name" id="Name" ref={inputRef} />
        <Button onClick={focusInput}>Focus input</Button>
      </div>
      {/* <input ref={inputRef} id="Name" placeholder="Enter your name" /> */}
    </div>
  );
}

export default Refs;
