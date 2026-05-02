import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, History, Moon, Sun, Lightbulb } from 'lucide-react';
import QuickTipsModal from './QuickTipsModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showTips, setShowTips] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">CS-GO</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link to="/history" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setShowTips(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center group relative"
                title="Quick Tips & Motivation"
              >
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span className="hidden lg:inline ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tips</span>
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>

              <div className="flex items-center ml-2 border-l border-gray-200 dark:border-gray-700 pl-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4 hidden sm:block">
                  Hi, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium transition-colors">Dashboard</Link>
            <Link to="/history" className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium transition-colors">History</Link>
          </div>
        </div>
      </nav>
      
      <QuickTipsModal isOpen={showTips} onClose={() => setShowTips(false)} />
    </>
  );
};

export default Navbar;
