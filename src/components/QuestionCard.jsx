import React from 'react';

const QuestionCard = ({ question, selectedOption, onSelectOption }) => {
  if (!question) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-start">
          <span className="text-blue-600 dark:text-blue-400 mr-2 font-bold">Q.</span>
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div
            key={index}
            onClick={() => onSelectOption(index)}
            className={`
              relative flex cursor-pointer rounded-lg px-5 py-4 shadow-sm focus:outline-none border-2 transition-all duration-200
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
