import { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(2);

  useEffect(() => {
    const timeoutId  = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeoutId );
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCount((prev) => prev + 1);
      console.log(count);
    }, 3000);

    return () => clearInterval(timeoutId);
  }, []);

  return <div className="App">{count}</div>;
}

//2

import { useEffect, useRef, useState } from "react";

export default function ControlledInterval() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setCount((c) => c + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setRunning((r) => !r)}>
        {running ? "Pause" : "Resume"}
      </button>
    </div>
  );
}
