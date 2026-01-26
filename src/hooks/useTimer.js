import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime = 15) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  const startTimer = (onTimeUp) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(initialTime);

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(initialTime);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    startTimer,
    stopTimer,
    resetTimer
  };
};