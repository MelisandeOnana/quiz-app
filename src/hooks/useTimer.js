import { useState, useEffect } from 'react';

export const useTimer = (initialTime = 15, onTimeUp = null) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp]);

  const start = () => {
    setTimeLeft(initialTime);
    setIsRunning(true);
  };

  const stop = () => setIsRunning(false);
  
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  return { timeLeft, start, stop, reset, isRunning };
};