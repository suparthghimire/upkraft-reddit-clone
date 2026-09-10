import { useRef, useState } from "react";
import Button from "../components/core/button";
import Dialog from "../components/core/dialog";
import Input from "../components/core/input";

function DialogPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number>(null);

  function handleDialogOpenChange(openValue: boolean) {
    setDialogOpen(openValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (openValue) {
        if (inputRef.current) {
          console.log("FOCUS PLEASE");
          inputRef.current.focus();
        }
      }
    }, 0);
  }

  return (
    <div>
      <Button
        onClick={() => {
          handleDialogOpenChange(true);
        }}
      >
        Open Dialog
      </Button>

      {dialogOpen.toString()}

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <p>Hello there, how are you?</p>

        <Input ref={inputRef} placeholder="Type something..." />
      </Dialog>
    </div>
  );
}

export default DialogPage;
