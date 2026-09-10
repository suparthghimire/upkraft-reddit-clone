import Typography from "@/components/ui/typogrpahy";
import { steps } from "../_utils";
import { cn } from "@/lib/utils";

function Stepper(props: { currStep: number }) {
  return (
    <div className="flex items-center gap-1.5 w-full">
      {steps.map((step) => (
        <Step
          key={step.index}
          currStep={step.index}
          isCurrOrOld={step.index <= props.currStep}
        />
      ))}
    </div>
  );
}

function Step(props: { isCurrOrOld: boolean; currStep: number }) {
  const stepInfo = steps[props.currStep];

  if (!stepInfo) return null;

  const titles = stepInfo.title.split(" ");

  return (
    <div className="flex w-full flex-col gap-2">
      <Typography className="text-secondary-foreground">
        {titles[0]}
        <br />
        {titles[1]}
      </Typography>
      <div
        className={cn(
          "w-full h-1.5 bg-border",
          props.isCurrOrOld && "bg-primary",
          props.currStep === 0 && "rounded-l-full",
          props.currStep === steps.length - 1 && "rounded-r-full",
        )}
      />
    </div>
  );
}

export default Stepper;
