import { createContext, useState, useEffect, useContext, useCallback, type ReactNode } from 'react';
import { getQuizProgress, saveQuizProgress, clearQuizProgress, saveQuizResult, getAdminTests, getAdminQuestions } from '../utils/storage';
import { tests } from '../data/tests';
import { questions } from '../data/questions';
import { calculateScore } from '../utils/helpers';

interface QuizContextType {
  activeTest: string | number | null;
  answers: Record<string, number>;
  markedForReview: Record<string, boolean>;
  visitedQuestions: Record<string, boolean>;
  currentQuestionIndex: number;
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  startQuiz: (testId: string | number) => void;
  answerQuestion: (questionId: string, optionIndex: number) => void;
  clearAnswer: (questionId: string) => void;
  toggleReview: (questionId: string) => void;
  visitQuestion: (questionId: string) => void;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitQuiz: () => any;
}

// eslint-disable-next-line react-refresh/only-export-components
export const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [activeTest, setActiveTest] = useState<string | number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Record<string, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Load progress on mount
  useEffect(() => {
    const initProgress = () => {
      const progress = getQuizProgress();
      if (progress) {
        setActiveTest(progress.activeTest);
        setAnswers(progress.answers || {});
        setMarkedForReview(progress.markedForReview || {});
        setVisitedQuestions(progress.visitedQuestions || {});
        setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
        
        // Calculate remaining time
        const elapsed = Math.floor((Date.now() - progress.startTime) / 1000);
        const remaining = Math.max(0, progress.duration * 60 - elapsed);
        setTimeRemaining(remaining);
      }
    };
    initProgress();
  }, []);

  // Save progress periodically when active test changes
  useEffect(() => {
    if (activeTest) {
      const allTests = [...getAdminTests(), ...tests];
      const test = allTests.find((t) => String(t.id) === String(activeTest));
      if (!test) return;

      const progress = getQuizProgress();
      const startTime = progress?.activeTest === activeTest ? progress.startTime : Date.now();
      const duration = progress?.activeTest === activeTest ? progress.duration : test.duration;
      
      saveQuizProgress({
        activeTest,
        answers,
        markedForReview,
        visitedQuestions,
        currentQuestionIndex,
        startTime,
        duration
      });
    }
  }, [activeTest, answers, markedForReview, visitedQuestions, currentQuestionIndex]);

  const startQuiz = (testId: string | number) => {
    const allTests = [...getAdminTests(), ...tests];
    const test = allTests.find((t) => String(t.id) === String(testId));
    if (!test) return;

    setActiveTest(testId);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(test.duration * 60);
    saveQuizProgress({
      activeTest: testId,
      answers: {},
      markedForReview: {},
      visitedQuestions: {},
      currentQuestionIndex: 0,
      startTime: Date.now(),
      duration: test.duration
    });
  };

  const answerQuestion = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setVisitedQuestions(prev => ({ ...prev, [questionId]: true }));
  };

  const clearAnswer = (questionId: string) => {
    setAnswers(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
    setVisitedQuestions(prev => ({ ...prev, [questionId]: true }));
  };

  const toggleReview = (questionId: string) => {
    setMarkedForReview(prev => {
      const updated = { ...prev };
      if (updated[questionId]) {
        delete updated[questionId];
      } else {
        updated[questionId] = true;
      }
      return updated;
    });
    setVisitedQuestions(prev => ({ ...prev, [questionId]: true }));
  };

  const visitQuestion = useCallback((questionId: string) => {
    setVisitedQuestions(prev => (prev[questionId] ? prev : { ...prev, [questionId]: true }));
  }, []);

  const submitQuiz = () => {
    if (!activeTest) return null;
    
    const allTests = [...getAdminTests(), ...tests];
    const allQuestions = [...getAdminQuestions(), ...questions];
    const test = allTests.find((t) => String(t.id) === String(activeTest));
    if (!test) return null;

    const testQuestions = test.questionIds.map((id) => allQuestions.find((q) => String(q.id) === String(id))).filter(Boolean);
    
    const scoreData = calculateScore(answers, testQuestions);
    const result = {
      id: Date.now().toString(),
      testId: test.id,
      testTitle: test.title,
      date: new Date().toISOString(),
      score: scoreData,
      answers,
      markedForReview,
      visitedQuestions,
      completedAt: Date.now()
    };

    saveQuizResult(result);
    // clean up
    clearQuizProgress();
    setActiveTest(null);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({});
    setCurrentQuestionIndex(0);
    
    return result;
  };

  return (
    <QuizContext.Provider value={{
      activeTest,
      answers,
      markedForReview,
      visitedQuestions,
      currentQuestionIndex,
      timeRemaining,
      setTimeRemaining,
      startQuiz,
      answerQuestion,
      clearAnswer,
      toggleReview,
      visitQuestion,
      setCurrentQuestionIndex,
      submitQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
