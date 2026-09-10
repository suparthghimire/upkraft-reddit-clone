import AdditionalInformation from "../_components/steps/additional-information";
import CoverageOptions from "../_components/steps/coverage-options";
import PersonalInformation from "../_components/steps/personal-information";
import TripInformation from "../_components/steps/tip-information";

export const steps = [
  {
    index: 0,
    title: "Personal Information",
    component: PersonalInformation,
  },
  {
    index: 1,
    title: "Trip Information",
    component: TripInformation,
  },
  {
    index: 2,
    title: "Coverage Options",
    component: CoverageOptions,
  },
  {
    index: 3,
    title: "Additional Information",
    component: AdditionalInformation,
  },
];
