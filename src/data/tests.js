import { questions } from './questions';

export const tests = [
  {
    id: 1,
    title: "NIMCET Full Mock Test 1",
    subject: "Mixed",
    duration: 15, // minutes for testing, normally 120
    questionIds: questions.map(q => q.id)
  },
  {
    id: 2,
    title: "Mathematics Practice Test",
    subject: "Maths",
    duration: 5,
    questionIds: questions.filter(q => q.subject === "Maths").map(q => q.id)
  },
  {
    id: 3,
    title: "Computer Science Basics",
    subject: "CS",
    duration: 5,
    questionIds: questions.filter(q => q.subject === "CS").map(q => q.id)
  },
  {
    id: 4,
    title: "Logical Reasoning Quiz",
    subject: "LR",
    duration: 5,
    questionIds: questions.filter(q => q.subject === "LR").map(q => q.id)
  }
];
