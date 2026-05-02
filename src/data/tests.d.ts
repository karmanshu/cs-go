// Data type declarations

export interface Question {
  id: number | string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Test {
  id: number | string;
  title: string;
  subject: string;
  duration: number;
  questionIds: Array<number | string>;
  createdByAdmin?: boolean;
  createdAt?: string;
}

export const tests: Test[];
