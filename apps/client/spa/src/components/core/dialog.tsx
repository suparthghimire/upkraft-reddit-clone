import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type Props = PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;
function Dialog(props: Props) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0,0,0,0.5)",
        width: "100%",
        display: props.open ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
      onClick={() => {
        props.onOpenChange(false);
      }}
    >
      <div
        style={{
          padding: 10,
          background: "white",
          borderRadius: 6,
          position: "relative",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "transparent",
            padding: 0,
            border: "none",
          }}
          onClick={() => {
            props.onOpenChange(false);
          }}
        >
          X
        </button>
        <div
          style={{
            marginTop: 20,
          }}
        >
          {props.children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Dialog;
