import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialTime = 15) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  const startTimer = useCallback((onTimeUp) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(initialTime);

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === 1) {
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
  }, [initialTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(initialTime);
  }, [initialTime, stopTimer]);

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