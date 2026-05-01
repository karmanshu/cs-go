import React from 'react';
import { Clock, HelpCircle, ArrowRight } from 'lucide-react';

const TestCard = ({ test, onStart }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 transition-all hover:shadow-md hover:border-blue-300 flex flex-col h-full">
      <div className="px-4 py-5 sm:p-6 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {test.subject}
          </span>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2 mb-4">
          {test.title}
        </h3>
        
        <div className="mt-2 flex flex-col space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <HelpCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span>{test.questionIds.length} Questions</span>
          </div>
          <div className="flex items-center">
            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span>{test.duration} Minutes</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6 mt-auto">
        <button
          onClick={() => onStart(test.id)}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Start Test
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TestCard;
