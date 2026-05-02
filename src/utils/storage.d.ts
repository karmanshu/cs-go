// Storage utilities type declarations

export interface User {
  username: string;
  role?: 'student' | 'admin';
  sessionId: string;
  createdAt: number;
  expiresAt: number;
}

export interface QuizProgress {
  activeTest: string | number;
  answers: Record<string, number>;
  markedForReview?: Record<string, boolean>;
  visitedQuestions?: Record<string, boolean>;
  currentQuestionIndex?: number;
  startTime: number;
  duration: number;
}

export interface QuizResult {
  id: string;
  testId: string | number;
  testTitle: string;
  date: string;
  score: {
    correct: number;
    wrong: number;
    unattempted: number;
    total: number;
  };
  answers: Record<string, number>;
}

export interface AdminQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface AdminTest {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questionIds: string[];
  createdByAdmin?: boolean;
  createdAt?: string;
}

export const saveUser: (username: string, remember?: boolean, role?: 'student' | 'admin') => User;
export const getUser: () => User | null;
export const removeUser: () => void;
export const saveQuizProgress: (data: QuizProgress) => void;
export const getQuizProgress: () => QuizProgress | null;
export const clearQuizProgress: () => void;
export const saveQuizResult: (result: QuizResult) => void;
export const getQuizResults: () => QuizResult[];
export const getAdminTests: () => AdminTest[];
export const getAdminQuestions: () => AdminQuestion[];
export const saveAdminQuiz: (quiz: { test: AdminTest; questions: AdminQuestion[] }) => void;
