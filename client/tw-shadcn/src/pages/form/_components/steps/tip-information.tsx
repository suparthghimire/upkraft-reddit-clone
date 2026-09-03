import type { FormSchema } from "../../_schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {ComboboxPopup } from "@/components/ui/country-dropdown";

import { DatePicker } from "@/components/ui/date-picker";

import { Controller, type UseFormReturn } from "react-hook-form";
import { useSteps } from "../../_providers/step-provider";
import FormButtons from "../form-buttons";

const fieldsInThisStep: (keyof FormSchema)[] = [
  "destinationCountry",
  "departureCountry",
  "departureDate",
  "returnDate",
  "numberOfTravelers",
];

function TripInformation(props: { form: UseFormReturn<FormSchema> }) {
  const { form } = props;

  const { handleNext } = useSteps();

  async function onNext() {
    // Just trigger the form for these steps
    const isValid = await form.trigger(fieldsInThisStep); // HERE .trigger() 
    if (!isValid) return;
    handleNext();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Departure Country - Using Combobox */}
      <FieldGroup>
        <Controller
          control={form.control}
          name="departureCountry"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="departureCountry">
                  Departure Country
                </FieldLabel>
                <ComboboxPopup value={field.value} onChange={field.onChange} />


                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      {/* Destination Country - Using Combobox */}
      <FieldGroup>
        <Controller
          control={form.control}
          name="destinationCountry"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="destinationCountry">
                  Destination Country
                </FieldLabel>
                <ComboboxPopup value={field.value} onChange={field.onChange} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      {/* Departure Date */}
      <FieldGroup>
        <Controller
          control={form.control}
          name="departureDate"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="departureDate">Departure Date</FieldLabel>
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

      {/* Return Date */}
      <FieldGroup>
        <Controller
          control={form.control}
          name="returnDate"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="returnDate">Return Date</FieldLabel>
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

      {/* Number of Travelers */}
      <FieldGroup>
        <Controller
          control={form.control}
          name="numberOfTravelers"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="numberOfTravelers">
                  Number of Travelers
                </FieldLabel>
                <input
                  id="numberOfTravelers"
                  type="number"
                  min="1"
                  max="6"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

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

export default TripInformation;