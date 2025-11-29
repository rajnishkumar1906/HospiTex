import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../Auth/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
// ✅ FIXED: Rename User icon to UserIcon to avoid conflict
import { Home, Phone, User as UserIcon, Calendar, LogOut, Menu, X } from 'lucide-react';
import apiClient from '../../config/axios';

function PatientNavbar() {
  const { IsLoggedIn, setIsLoggedIn, UserRole, setUserRole, User } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userInitial = User?.username ? User.username.charAt(0).toUpperCase() : '';

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setDropdownOpen(false);
      setIsLoggedIn(false);
      setUserRole(null);
      navigate('/');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fixed isActive function - only exact match for home, otherwise prefix match
  const isActive = (path) => {
    if (path === '/patient-dashboard/' || path === '/patient-dashboard') {
      return location.pathname === '/patient-dashboard' || 
             location.pathname === '/patient-dashboard/';
    }
    return location.pathname === path;
  };

  return (
    <nav className="w-full shadow-lg bg-white/95 backdrop-blur-md fixed top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/patient-dashboard/')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Hospi
              </span>
              <span className="text-2xl font-black text-gray-900">Tex</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/patient-dashboard/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive('/patient-dashboard/')
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link
              to="/patient-dashboard/contacts"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive('/patient-dashboard/contacts')
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Phone className="w-4 h-4" />
              Contact
            </Link>

            {IsLoggedIn && userInitial && (
              <div className="relative ml-4" ref={dropdownRef}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-lg cursor-pointer shadow-lg"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {userInitial}
                </motion.div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 z-50"
                    >
                      <Link
                        to="/patient-dashboard/patientprofile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {/* ✅ FIXED: Use UserIcon instead of User */}
                        <UserIcon className="w-4 h-4" />
                        View Profile
                      </Link>
                      <Link 
                        to="/patient-dashboard/appointment-history"
                        className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Calendar className="w-4 h-4" />
                        My Appointments
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/patient-dashboard/"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                  isActive('/patient-dashboard/')
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link
                to="/patient-dashboard/contacts"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                  isActive('/patient-dashboard/contacts')
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="w-5 h-5" />
                Contact
              </Link>
              {IsLoggedIn && (
                <>
                  <Link
                    to="/patient-dashboard/patientprofile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {/* ✅ FIXED: Use UserIcon instead of User */}
                    <UserIcon className="w-5 h-5" />
                    View Profile
                  </Link>
                  <Link
                    to="/patient-dashboard/appointment-history"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar className="w-5 h-5" />
                    My Appointments
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default PatientNavbar;