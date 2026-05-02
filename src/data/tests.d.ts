// Data type declarations

export interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Test {
  id: number;
  title: string;
  subject: string;
  duration: number;
  questionIds: number[];
}

export const tests: Test[];