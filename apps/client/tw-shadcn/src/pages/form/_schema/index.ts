import { z } from "zod";
import { COUNTRIES } from "../_utils/countries";
import { isValidPhoneNumber } from "react-phone-number-input";

const makeCountrySchema = (args: {
  invalidErrMsg: string;
  missingErrMsg: string;
}) => {
  return z
    .string(args.invalidErrMsg)
    .min(1, args.missingErrMsg)
    .refine((value) => {
      return COUNTRIES.some((country) => country["alpha-2"] === value);
    }, "Please select a valid country");
};

export const formSchema = z
  .object({
    // Personal
    name: z.string("Name should be a valid string").min(1, "Name is required"),
    email: z.email("Email is invalid"),
    phone: z
      .string("Phone should be a valid string")
      .min(1, "Phone is required")
      .refine((value) => {
        // Add logic to check if phone no is valid
        const isValidPhone = isValidPhoneNumber(value);
        return isValidPhone;
      }, "Phone number is invalid"),
    dob: z.date("Date of Birth should be a valid date").refine((date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 18;
    }, "You must be at least 18 years old"),
    gender: z.enum(["male", "female", "other"], "Please select a valid gender"),

    // Trip Info
    departureCountry: makeCountrySchema({
      invalidErrMsg: "Departure country is invalid",
      missingErrMsg: "Departure country is required",
    }),
    destinationCountry: makeCountrySchema({
      invalidErrMsg: "Destination country is invalid",
      missingErrMsg: "Destination country is required",
    }),
    departureDate: z.date("Departure date should be a valid date"),
    returnDate: z.date("Return date should be a valid date"),
    numberOfTravelers: z
      .number("Number of travelers should be a valid number")
      .min(1, "Number of travelers must be at least 1"),

    // Coverage Options
    type: z.enum(
      ["single-trip", "couple-trip", "group-trip"],
      "Coverage type is required",
    ),
    medicalCoverageAmount: z.number(
      "Medical coverage amount should be a valid number",
    ),
    currency: z.enum(["EUR", "NPR", "USD", "INR"], "Currency is required"),
    tripCancellationCoverage: z.boolean(
      "Trip cancellation should be a boolean",
    ),
    baggageCoverage: z.boolean("Baggage coverage should be a boolean"),
    emergencyEvacuationCoverage: z.boolean(
      "Emergency evacuation coverage should be a boolean",
    ),

    // Additional Info
    passportNumber: z
      .string("Passport number should be a valid string")
      .min(1, "Passport number is required"),
    address: z
      .string("Address should be a valid string")
      .min(1, "Address is required"),
    city: z.string("City should be a valid string").min(1, "City is required"),
    zip: z
      .string("ZIP code should be a valid string")
      .min(1, "ZIP code is required"),
    travellingWithPets: z.boolean("Travelling with pets should be a boolean"),
    preexistingMedicalConditions: z.string(),
    sepcialRequirements: z.string(),
  })
  .refine(
    (data) => {
      // Check if return date is after departure date
      if (data.returnDate <= data.departureDate) {
        return false;
      }
      return true;
    },
    {
      error: "Return date must be after departure date",
      path: ["returnDate"],
    },
  );

export type FormSchema = z.infer<typeof formSchema>;
export const defaultFormValues: FormSchema = {
  name: "",
  email: "",
  phone: "",
  dob: new Date(),
  gender: "male",
  departureCountry: "",
  destinationCountry: "",
  departureDate: new Date(),
  returnDate: new Date(),
  numberOfTravelers: 1,
  type: "single-trip",
  medicalCoverageAmount: 0,
  currency: "USD",
  tripCancellationCoverage: false,
  baggageCoverage: false,
  emergencyEvacuationCoverage: false,
  passportNumber: "",
  address: "",
  city: "",
  zip: "",
  travellingWithPets: false,
  preexistingMedicalConditions: "",
  sepcialRequirements: "",
};
