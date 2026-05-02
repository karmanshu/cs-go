// Helpers
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const calculateScore = (answers, questions) => {
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;
  const details = [];

  questions.forEach(q => {
    const hasAnswer = Object.prototype.hasOwnProperty.call(answers, q.id);
    const selectedAnswer = hasAnswer ? Number(answers[q.id]) : null;
    const correctAnswer = Number(q.correctAnswer);
    const isAnswered = selectedAnswer !== null && Number.isInteger(selectedAnswer);
    const isCorrect = isAnswered && selectedAnswer === correctAnswer;

    if (!isAnswered) {
      unattempted++;
    } else if (isCorrect) {
      correct++;
    } else {
      wrong++;
    }

    details.push({
      questionId: q.id,
      selectedAnswer: isAnswered ? selectedAnswer : null,
      correctAnswer,
      isCorrect,
      isAnswered
    });
  });

  return {
    correct,
    wrong,
    unattempted,
    attempted: correct + wrong,
    total: questions.length,
    totalScore: correct * 4 - wrong,
    details
  };
};
