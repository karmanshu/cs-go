// Data type declarations

export interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const questions: Question[];