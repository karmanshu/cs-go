// Storage utilities type declarations

export interface User {
  username: string;
  sessionId: string;
  createdAt: number;
  expiresAt: number;
}

export interface QuizProgress {
  activeTest: string;
  answers: Record<string, number>;
  startTime: number;
  duration: number;
}

export interface QuizResult {
  id: string;
  testId: string;
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

export const saveUser: (username: string, remember?: boolean) => User;
export const getUser: () => User | null;
export const removeUser: () => void;
export const saveQuizProgress: (data: QuizProgress) => void;
export const getQuizProgress: () => QuizProgress | null;
export const clearQuizProgress: () => void;
export const saveQuizResult: (result: QuizResult) => void;
export const getQuizResults: () => QuizResult[];
