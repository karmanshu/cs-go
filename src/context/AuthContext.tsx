import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { getUser, saveUser, removeUser } from '../utils/storage';

interface User {
  username: string;
  sessionId: string;
  createdAt: number;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, remember?: boolean) => void;
  logout: () => void;
  loading: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const loggedInUser = getUser();
      if (loggedInUser) {
        setUserState(loggedInUser);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (username: string, remember = false) => {
    const savedUser = saveUser(username, remember);
    setUserState(savedUser);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
