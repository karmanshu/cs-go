// Storage utilities
export const saveUser = (username) => {
  localStorage.setItem('user', JSON.stringify({ username }));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const saveQuizProgress = (data) => {
  localStorage.setItem('quiz_progress', JSON.stringify(data));
};

export const getQuizProgress = () => {
  const progress = localStorage.getItem('quiz_progress');
  return progress ? JSON.parse(progress) : null;
};

export const clearQuizProgress = () => {
  localStorage.removeItem('quiz_progress');
};

export const saveQuizResult = (result) => {
  const results = getQuizResults();
  results.push(result);
  localStorage.setItem('quiz_results', JSON.stringify(results));
};

export const getQuizResults = () => {
  const results = localStorage.getItem('quiz_results');
  return results ? JSON.parse(results) : [];
};
