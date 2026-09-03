import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type StepsContextType = {
  step: number;
  handleNext: () => void;
  handleBack: () => void;
  gotoStep: (step: number) => void;
};

const StepsContext = createContext<StepsContextType>({} as StepsContextType);

function StepsProvider(props: PropsWithChildren) {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const gotoStep = (step: number) => {
    setStep(step);
  };

  return (
    <StepsContext.Provider
      value={{
        gotoStep,
        handleBack,
        handleNext,
        step,
      }}
    >
      {props.children}
    </StepsContext.Provider>
  );
}

export default StepsProvider;

export const useSteps = () => {
  const context = useContext(StepsContext);

  if (!context) {
    throw new Error("useSteps must be used within a StepsProvider");
  }

  return context;
};
