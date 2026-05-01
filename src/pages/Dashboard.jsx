import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import { AuthContext } from '../context/AuthContext';
import TestCard from '../components/TestCard';
import { tests } from '../data/tests';
import { PlayCircle } from 'lucide-react';

const Dashboard = () => {
  const { startQuiz, activeTest } = useContext(QuizContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    if (activeTest) {
      setShowResumeModal(true);
    }
  }, [activeTest]);

  const handleResume = () => {
    setShowResumeModal(false);
    navigate('/quiz');
  };

  const handleNewTest = () => {
    setShowResumeModal(false);
  };

  const handleStartTest = (testId) => {
    startQuiz(testId);
    navigate('/quiz');
  };

  return (
    <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
          
          <div className="px-4 pb-8 sm:px-0">
            <h1 className="text-3xl font-bold font-sans text-gray-900 dark:text-white mb-2">Welcome, {user?.username}</h1>
            <p className="text-gray-600 dark:text-gray-400">Select a mock test below to check your preparation level.</p>
          </div>
          
          <div className="px-4 sm:px-0">
            {activeTest && (
              <div className="mb-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">Test in progress</h3>
                  <p className="text-blue-700 dark:text-blue-300">You have an ongoing test. Don't lose your progress!</p>
                </div>
                <button
                  onClick={() => navigate('/quiz')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Resume Test
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map(test => (
                <TestCard 
                  key={test.id} 
                  test={test} 
                  onStart={handleStartTest} 
                />
              ))}
            </div>
          </div>
          
        </div>
      </main>

      {/* Resume Test Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all scale-100 opacity-100">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
              <PlayCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Resume Test?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              You have a test in progress! Would you like to pick up where you left off?
            </p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleResume}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
              >
                Resume Progress
              </button>
              <button 
                onClick={handleNewTest}
                className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Start Different Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
