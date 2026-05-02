import React from 'react';
import { Bookmark, Check } from 'lucide-react';

const QuestionCard = ({ question, selectedOption, onSelectOption, isMarkedForReview }) => {
  if (!question) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white flex items-start">
          <span className="text-blue-600 dark:text-blue-400 mr-3 font-bold">Q.</span>
          <span>{question.question}</span>
        </h2>
        {isMarkedForReview && (
          <span className="inline-flex items-center self-start rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-200">
            <Bookmark className="mr-1.5 h-3.5 w-3.5 fill-violet-600 text-violet-600 dark:fill-violet-300 dark:text-violet-300" />
            Review
          </span>
        )}
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            type="button"
            key={index}
            onClick={() => onSelectOption(index)}
            className={`
              relative flex w-full cursor-pointer rounded-lg px-5 py-4 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 border-2 transition-all duration-200
              ${selectedOption === index 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
            `}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <div className="text-sm">
                  <div className="flex items-center">
                    <span className={`
                      h-6 w-6 rounded-full border flex items-center justify-center mr-3 text-sm flex-shrink-0 transition-colors
                      ${selectedOption === index 
                        ? 'border-blue-600 bg-blue-600 text-white' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}
                    `}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <p className={`font-medium transition-colors ${selectedOption === index ? 'text-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-gray-200'}`}>
                      {option}
                    </p>
                  </div>
                </div>
              </div>
              {selectedOption === index && (
                <Check className="ml-4 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
