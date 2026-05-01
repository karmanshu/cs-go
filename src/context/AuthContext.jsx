import React, { createContext, useState, useEffect } from 'react';
import { getUser, saveUser, removeUser } from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = getUser();
    if (loggedInUser) {
      setUserState(loggedInUser);
    }
    setLoading(false);
  }, []);

  const login = (username) => {
    saveUser(username);
    setUserState({ username });
  };

  const logout = () => {
    removeUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
