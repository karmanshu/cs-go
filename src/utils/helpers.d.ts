// Helpers type declarations

export interface ScoreData {
  correct: number;
  wrong: number;
  unattempted: number;
  attempted: number;
  total: number;
  totalScore: number;
  details: ScoreDetail[];
}

export interface ScoreDetail {
  questionId: number;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  isAnswered: boolean;
}

export const formatTime: (seconds: number) => string;
export const calculateScore: (answers: Record<string, number>, questions: Question[]) => ScoreData;

interface Question {
  id: number;
  correctAnswer: number;
}
