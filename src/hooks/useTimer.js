import { useState, useEffect } from 'react';

export const useTimer = (initialTime = 15) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const start = () => {
    setIsRunning(true);
    setTimeLeft(initialTime);
  };

  const stop = () => setIsRunning(false);
  
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  return { timeLeft, start, stop, reset, isRunning };
};