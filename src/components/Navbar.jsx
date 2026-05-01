import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, History } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">CS-GO: NIMCET ki Meki</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/history" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <History className="w-4 h-4 mr-2" />
                History
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-sm text-gray-700 mr-4">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="pt-2 pb-3 space-y-1">
          <Link to="/" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium">Dashboard</Link>
          <Link to="/history" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium">History</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
