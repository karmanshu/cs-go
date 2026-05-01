import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import { tests } from '../data/tests';
import { questions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const Quiz = () => {
  const { activeTest, answers, answerQuestion, submitQuiz } = useContext(QuizContext);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // redirect if no active test
  useEffect(() => {
    if (!activeTest) {
      navigate('/');
    }
  }, [activeTest, navigate]);

  const test = useMemo(() => tests.find(t => t.id === activeTest), [activeTest]);
  const testQuestions = useMemo(() => {
    if (!test) return [];
    return test.questionIds.map(id => questions.find(q => q.id === id));
  }, [test]);

  if (!test || testQuestions.length === 0) return null;

  const currentQuestion = testQuestions[currentIndex];
  
  const handleNext = () => {
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const [modalType, setModalType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitClick = () => {
    setModalType('confirm');
  };

  const handleConfirmSubmit = () => {
    setModalType(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const result = submitQuiz();
      navigate('/result', { state: { result } });
    }, 1500);
  };

  const handleCancelSubmit = () => {
    setModalType(null);
  };

  const handleTimeEnd = () => {
    setModalType('timeup');
  };

  const handleTimeUpAcknowledge = () => {
    setModalType(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const result = submitQuiz();
      navigate('/result', { state: { result } });
    }, 1500);
  };

  return (
    <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700 py-4 top-0 sticky z-10 w-full transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {test.title}
          </h1>
          <Timer onTimeEnd={handleTimeEnd} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Left column: Question Area */}
        <div className="lg:w-3/4 flex flex-col">
          <div className="mb-4 flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <span>Question {currentIndex + 1} of {testQuestions.length}</span>
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              {currentQuestion?.subject}
            </span>
          </div>

          <QuestionCard 
            question={currentQuestion} 
            selectedOption={answers[currentQuestion?.id]}
            onSelectOption={(optIndex) => answerQuestion(currentQuestion?.id, optIndex)} 
          />

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                currentIndex === 0
                  ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </button>
            
            {currentIndex === testQuestions.length - 1 ? (
              <button
                onClick={handleSubmitClick}
                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition"
              >
                Submit Test
                <CheckCircle className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Right column: Palette */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sticky top-24 transition-colors border dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Question Palette</h3>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {testQuestions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentIndex === idx;
                
                let btnClass = "w-10 h-10 rounded-md font-medium text-sm flex items-center justify-center transition-all border-2 ";
                
                if (isCurrent) {
                  btnClass += "border-blue-600 text-blue-700 font-bold ";
                } else {
                  btnClass += "border-transparent ";
                }

                if (isAnswered) {
                  btnClass += isCurrent ? "bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-400 text-green-800 dark:text-green-200 " : "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 ";
                } else {
                  btnClass += isCurrent ? "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white " : "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 ";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={btnClass}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
              <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded-sm mr-2 flex-shrink-0"></span> Answered ({Object.keys(answers).length})
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-gray-100 dark:bg-gray-700/50 rounded-sm mr-2 flex-shrink-0 border dark:border-gray-600"></span> Not Answered ({testQuestions.length - Object.keys(answers).length})
              </div>
            </div>
            
            <div className="mt-8">
              <button
                onClick={handleSubmitClick}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Modals and Overlays */}
      {modalType === 'confirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all scale-100 opacity-100">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="text-yellow-500 mr-2 text-3xl">⚠️</span> Confirm Submission
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">Are you sure you want to submit the test? You cannot change your answers after submission.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleCancelSubmit}
                className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSubmit}
                className="flex items-center px-6 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Yes, Submit
                <CheckCircle className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'timeup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all scale-100 opacity-100">
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
              <span className="mr-2 text-3xl">⏰</span> Time is up!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">Your allocated time has expired. Your answers will be automatically submitted now.</p>
            <div className="flex justify-end">
              <button 
                onClick={handleTimeUpAcknowledge}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-opacity duration-500">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 opacity-75"></div>
            <div className="animate-spin rounded-full h-24 w-24 border-r-4 border-l-4 border-green-500 opacity-75 absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 animate-pulse mb-4">
            Calculating your score...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-xl font-medium">Preparing Scoreboard & Analysis</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
