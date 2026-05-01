import React from 'react';
import { X, Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';

const tips = [
  {
    title: "Pomodoro Technique",
    desc: "Study for 25 minutes, then take a 5-minute break. It keeps your mind fresh and focused.",
    icon: <Target className="w-6 h-6 text-orange-500" />
  },
  {
    title: "Active Recall",
    desc: "Test yourself on what you just read instead of just re-reading. It strengthens memory.",
    icon: <Zap className="w-6 h-6 text-yellow-500" />
  },
  {
    title: "Feynman Technique",
    desc: "Explain the concept in simple terms as if you were teaching a child.",
    icon: <Lightbulb className="w-6 h-6 text-blue-500" />
  },
  {
    title: "Spaced Repetition",
    desc: "Review material at increasing intervals over time to cement it in your long-term memory.",
    icon: <TrendingUp className="w-6 h-6 text-green-500" />
  }
];

const quotes = [
  "\"The secret of getting ahead is getting started.\" – Mark Twain",
  "\"It always seems impossible until it's done.\" – Nelson Mandela",
  "\"Don't watch the clock; do what it does. Keep going.\" – Sam Levenson",
  "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" – Winston Churchill"
];

const QuickTipsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative transform transition-all scale-100 opacity-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Lightbulb className="text-yellow-500" /> Quick Tips & Motivation
        </h2>
        
        <div className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 italic font-medium">
            {randomQuote}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                {tip.icon}
                <h3 className="font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            Let's Get Back to Work!
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickTipsModal;
