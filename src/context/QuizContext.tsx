import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { getQuizProgress, saveQuizProgress, clearQuizProgress, saveQuizResult } from '../utils/storage';
import { tests } from '../data/tests';
import { questions } from '../data/questions';
import { calculateScore } from '../utils/helpers';

interface QuizContextType {
  activeTest: string | null;
  answers: Record<string, number>;
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  startQuiz: (testId: string) => void;
  answerQuestion: (questionId: string, optionIndex: number) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitQuiz: () => any;
}

// eslint-disable-next-line react-refresh/only-export-components
export const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Load progress on mount
  useEffect(() => {
    const initProgress = () => {
      const progress = getQuizProgress();
      if (progress) {
        setActiveTest(progress.activeTest);
        setAnswers(progress.answers || {});
        
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const test = tests.find((t: any) => t.id === activeTest);
      if (!test) return;

      const progress = getQuizProgress();
      const startTime = progress?.activeTest === activeTest ? progress.startTime : Date.now();
      const duration = progress?.activeTest === activeTest ? progress.duration : test.duration;
      
      saveQuizProgress({
        activeTest,
        answers,
        startTime,
        duration
      });
    }
  }, [activeTest, answers]);

  const startQuiz = (testId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const test = tests.find((t: any) => t.id === testId);
    if (!test) return;

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

  const answerQuestion = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    if (!activeTest) return null;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const test = tests.find((t: any) => t.id === activeTest);
    if (!test) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const testQuestions = test.questionIds.map((id) => questions.find((q) => q.id === id)).filter(Boolean);
    
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

// eslint-disable-next-line react-refresh/only-export-components
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
