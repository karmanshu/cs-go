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
    <div className={`flex items-center px-4 py-2 rounded-lg border ${isLowTime ? 'bg-red-50 border-red-200 text-red-700 font-bold animate-pulse' : 'bg-white border-gray-200 text-gray-700'}`}>
      <Clock className={`w-5 h-5 mr-2 ${isLowTime ? 'text-red-500' : 'text-gray-500'}`} />
      <span className="text-xl tabular-nums font-mono">
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default Timer;
