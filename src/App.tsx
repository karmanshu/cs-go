// @ts-nocheck
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import History from './pages/History';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <QuizProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/result" 
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </QuizProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
