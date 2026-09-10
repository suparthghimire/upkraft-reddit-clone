import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { FormSchema } from "../../_schema";
import { Input } from "@/components/ui/input";
import FormButtons from "../form-buttons";
import { useSteps } from "../../_providers/step-provider";
import { PhoneInput } from "@/components/reui/phone-input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldsInThisStep: (keyof FormSchema)[] = [
  "name",
  "email",
  "phone",
  "dob",
  "gender",
];

function PersonalInformation(props: { form: UseFormReturn<FormSchema> }) {
  const { form } = props;

  const { handleNext } = useSteps();

  async function onNext() {
    // Just trigger the form for these steps
    const isValid = await form.trigger(fieldsInThisStep);
    if (!isValid) return;
    handleNext();
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                <Input
                  {...field}
                  id="full-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your full name"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <PhoneInput
                  {...field}
                  id="phone"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your phone"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="dob"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="date">Date of birth</FieldLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="gender"
          render={({ field, fieldState }) => {
            const items = [
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ] as const;
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={items}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FormButtons
        backProps={{
          disabled: true,
        }}
        nextProps={{
          onClick: onNext,
        }}
      />
    </div>
  );
}

export default PersonalInformation;
