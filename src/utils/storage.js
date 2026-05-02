// Storage utilities
const USER_STORAGE_KEY = 'cs_go_user';
const LEGACY_USER_STORAGE_KEY = 'user';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const getStorage = (remember = false) => (remember ? localStorage : sessionStorage);

const parseJson = (value) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const createSessionId = () => {
  const browserCrypto = globalThis.crypto;

  if (browserCrypto?.randomUUID) {
    return browserCrypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  browserCrypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const isValidUserSession = (user) => {
  if (!user || typeof user.username !== 'string') return false;
  if (typeof user.sessionId !== 'string' || user.sessionId.length < 16) return false;
  if (typeof user.expiresAt !== 'number' || user.expiresAt <= Date.now()) return false;
  return true;
};

export const saveUser = (username, remember = false) => {
  removeUser();

  const user = {
    username,
    sessionId: createSessionId(),
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  getStorage(remember).setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const getUser = () => {
  const sessionUser = parseJson(sessionStorage.getItem(USER_STORAGE_KEY));
  const persistentUser = parseJson(localStorage.getItem(USER_STORAGE_KEY));
  const legacyUser = parseJson(localStorage.getItem(LEGACY_USER_STORAGE_KEY));
  const activeUser = sessionUser || persistentUser;

  if (isValidUserSession(activeUser)) {
    return activeUser;
  }

  if (legacyUser?.username) {
    removeUser();
    return saveUser(String(legacyUser.username).trim(), false);
  }

  removeUser();
  return null;
};

export const removeUser = () => {
  sessionStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
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
