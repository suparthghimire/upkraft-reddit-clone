import { useEffect, useState } from "react";
import Button from "../components/core/button";

function HooksInReact() {
  const [count, setCount] = useState<number>(0);
  const [count2, setCount2] = useState<number>(0);

  //   let rawCount = 0;
  //   function increateRawCount() {
  //     rawCount += 1;
  //   }

  // Effects
  useEffect(
    () => {
      // This effect will run only first render
      console.log("HooksInReact mounted");

      // To run someting on unMount, we have to retrun another fn from useEffect
      return () => {
        // This fn is called a cleanup fn
        // And this will run everytime our component is unmounted
        console.log("HooksInReact unmounted");
      };
    },
    // Dependency array
    [],
  );

  // API calls

  // WE DONOT NEED THESE HOOKS ANYMORE
  // AFTER REACT v19, we have react compiler
  // WHICH WILL AUTO OPTIMIZE OUR COMPONENTS
  // AND WRAP WITH useMemo and useCallback wherever necessary.
  // So we don't need to use these hooks anymore.
  //   const someVal = useMemo(() => {}, []);
  //   const someFn = useCallback(() => {}, []);

  return (
    <div>
      1. Functions that starts with "use" and does something
      <br />
      2. That something is realated to react's component lifecycle
      <br />
      3. First hook: useState, we already have seen this
      <br />
      4. Second hook: useEffect
      <br />
      Examples:
      <br />
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment Count, Current Count: {count}
      </Button>
      <Button
        onClick={() => {
          setCount2(count2 + 1);
        }}
      >
        Increment Count2, Current Count2: {count2}
      </Button>
      {/* <Button
        onClick={() => {
          increateRawCount();
        }}
      >
        Increment Raw Count, Current Raw Count: {rawCount}
      </Button> */}
    </div>
  );
}

export default HooksInReact;
