import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Stepper from "./stepper";
import Typography from "@/components/ui/typogrpahy";
import FormFooter from "./footer";
import { steps } from "../_utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultFormValues, type FormSchema, formSchema } from "../_schema";
import { useSteps } from "../_providers/step-provider";

function FormPageContent() {
  const { step } = useSteps();
  const C = steps[step].component;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  return (
    <Card className="w-full max-w-95 mx-auto rounded-[8px] p-8 pb-4 h-full overflow-auto">
      <CardHeader className="p-0 flex flex-col gap-10 w-full">
        <Stepper currStep={step} />
        <Typography variant="h4Bold">{steps[step].title}</Typography>
      </CardHeader>

      <form
        id="some-form"
        onSubmit={(e) => e.preventDefault()}
        className="w-full"
      >
        <CardContent className="p-0">
          <C form={form} />
        </CardContent>
      </form>

      <FormFooter />
    </Card>
  );
}

export default FormPageContent;
