import { useEffect, useRef } from "react";

/**
 * Hook for running an interval in a component
 * @param callback Callback function that should be run on an interval
 * @param delay How many ms to wait between each run
 */
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};
