import React, { createContext, useState, useEffect, useContext } from 'react';
import { getQuizProgress, saveQuizProgress, clearQuizProgress, saveQuizResult } from '../utils/storage';
import { tests } from '../data/tests';
import { questions } from '../data/questions';
import { calculateScore } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Load progress on mount
  useEffect(() => {
    const progress = getQuizProgress();
    if (progress) {
      setActiveTest(progress.activeTest);
      setAnswers(progress.answers || {});
      
      // Calculate remaining time
      const elapsed = Math.floor((Date.now() - progress.startTime) / 1000);
      const remaining = Math.max(0, progress.duration * 60 - elapsed);
      setTimeRemaining(remaining);
    }
  }, []);

  // Save progress periodically when active test changes
  useEffect(() => {
    if (activeTest) {
      const currentProgress = getQuizProgress() || { 
        startTime: Date.now(), 
        duration: tests.find(t => t.id === activeTest).duration 
      };
      
      saveQuizProgress({
        activeTest,
        answers,
        startTime: currentProgress.startTime,
        duration: currentProgress.duration
      });
    }
  }, [activeTest, answers]);

  const startQuiz = (testId) => {
    const test = tests.find(t => t.id === testId);
    setActiveTest(testId);
    setAnswers({});
    setTimeRemaining(test.duration * 60);
    saveQuizProgress({
      activeTest: testId,
      answers: {},
      startTime: Date.now(),
      duration: test.duration
    });
  };

  const answerQuestion = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    if (!activeTest) return null;
    
    const test = tests.find(t => t.id === activeTest);
    const testQuestions = test.questionIds.map(id => questions.find(q => q.id === id));
    
    const scoreData = calculateScore(answers, testQuestions);
    const result = {
      id: Date.now().toString(),
      testId: test.id,
      testTitle: test.title,
      date: new Date().toISOString(),
      score: scoreData,
      answers: answers
    };

    saveQuizResult(result);
    // clean up
    clearQuizProgress();
    setActiveTest(null);
    setAnswers({});
    
    return result;
  };

  return (
    <QuizContext.Provider value={{
      activeTest,
      answers,
      timeRemaining,
      setTimeRemaining,
      startQuiz,
      answerQuestion,
      submitQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};
