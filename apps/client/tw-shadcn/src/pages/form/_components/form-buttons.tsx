import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function FormButtons(props: {
  backProps: {
    disabled?: boolean;
    onClick?: () => void;
  };
  nextProps: {
    disabled?: boolean;
    onClick?: () => void;
  };
}) {
  const { backProps, nextProps } = props;
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={backProps.onClick}
        disabled={backProps.disabled}
      >
        <ChevronLeft />
        Back
      </Button>
      <Button onClick={nextProps.onClick} disabled={nextProps.disabled}>
        Next
        <ChevronRight />
      </Button>
    </div>
  );
}

export default FormButtons;
