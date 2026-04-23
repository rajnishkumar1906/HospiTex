import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, User, Activity } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useApp();

  const getRoleColor = () => {
    switch (user?.role) {
      case 'Patient': return 'bg-green-100 text-green-700';
      case 'Doctor': return 'bg-blue-100 text-blue-700';
      case 'Diagnostic': return 'bg-purple-100 text-purple-700';
      case 'Admin': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-primary-600">HospiTex</span>
          </Link>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="flex items-center space-x-3">
              <div className={'px-3 py-1 rounded-full text-sm font-medium ' + getRoleColor()}>
                {user?.role}
              </div>
              <span className="text-gray-700 font-medium hidden md:block">{user?.username}</span>
              <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
