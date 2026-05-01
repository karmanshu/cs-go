import React, { useEffect, useContext, useRef } from 'react';
import { Clock } from 'lucide-react';
import { QuizContext } from '../context/QuizContext';
import { formatTime } from '../utils/helpers';

const Timer = ({ onTimeEnd }) => {
  const { timeRemaining, setTimeRemaining } = useContext(QuizContext);
  const timerRef = useRef(null);
  
  useEffect(() => {
    // Start interval
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (onTimeEnd) setTimeout(() => onTimeEnd(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [setTimeRemaining, onTimeEnd]);

  const isLowTime = timeRemaining < 300; // Less than 5 minutes

  return (
    <div className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${isLowTime ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-bold animate-pulse' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
      <Clock className={`w-5 h-5 mr-2 ${isLowTime ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
      <span className="text-xl tabular-nums font-mono">
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default Timer;
