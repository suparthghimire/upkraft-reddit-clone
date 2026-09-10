import { useEffect, useState } from "react";

// Increment the counter automatically every 1 sec
// Hint: Use setInterval

function AutomaticCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>count: {count}</div>;
}

export default AutomaticCounter;
