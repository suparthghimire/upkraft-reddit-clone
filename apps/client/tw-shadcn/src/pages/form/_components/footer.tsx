import { CardFooter } from "@/components/ui/card";
import Typography from "@/components/ui/typogrpahy";

function FormFooter() {
  return (
    <CardFooter className="p-0 text-center mt-auto justify-center">
      <Typography className="text-center">Stuck on the form?</Typography>
      &nbsp;
      <Typography
        variant="medium"
        className="text-center underline cursor-pointer"
      >
        Let's call you
      </Typography>
    </CardFooter>
  );
}

export default FormFooter;
