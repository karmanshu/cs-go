import React, { useState, useEffect } from 'react';
import { getQuizResults } from '../utils/storage';
import { Calendar, Target, Award, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const History = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const historicalResults = getQuizResults();
    // Sort by date descending
    historicalResults.sort((a, b) => new Date(b.date) - new Date(a.date));
    setResults(historicalResults);
  }, []);

  return (
    <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-900 dark:text-white mb-2">Test History</h1>
            <p className="text-gray-600 dark:text-gray-400">Review your past performances to track improvement.</p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700 transition-colors">
            <Award className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No history found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't taken any mock tests yet.</p>
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Tests
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result) => (
              <div key={result.id} className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-700">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {result.testTitle}
                    </h3>
                    <div className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                      {new Date(result.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="text-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Score</p>
                      <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{result.score.correct * 4 - result.score.wrong}</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Accuracy</p>
                      <p className="text-xl font-bold text-green-900 dark:text-green-100">
                        {result.score.total > 0 ? ((result.score.correct / result.score.total) * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-4 sm:px-6">
                  <div className="grid grid-cols-3 gap-4 text-sm text-center">
                    <div>
                      <span className="font-semibold text-green-600 dark:text-green-400">{result.score.correct}</span> Correct
                    </div>
                    <div>
                      <span className="font-semibold text-red-600 dark:text-red-400">{result.score.wrong}</span> Incorrect
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 dark:text-gray-400">{result.score.unattempted}</span> Skipped
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
