import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialTime = 15) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((onTimeUp) => {
    clearTimer();
    setTimeLeft(initialTime);

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === 1) {
          clearTimer();
          onTimeUp?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [initialTime, clearTimer]);

  const stopTimer = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(initialTime);
  }, [initialTime, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    timeLeft,
    startTimer,
    stopTimer,
    resetTimer
  };
};