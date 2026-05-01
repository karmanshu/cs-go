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

  questions.forEach(q => {
    const ans = answers[q.id];
    if (ans === undefined || ans === null) {
      unattempted++;
    } else if (ans === q.correctAnswer) {
      correct++;
    } else {
      wrong++;
    }
  });

  return { correct, wrong, unattempted, total: questions.length };
};
