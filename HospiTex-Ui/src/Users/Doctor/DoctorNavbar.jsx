import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../Auth/AppContext";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Stethoscope, 
  Calendar, 
  FileText,
  ClipboardList
} from 'lucide-react';
import apiClient from '../../config/axios';
import NotificationBell from '../../components/NotificationBell';

function DoctorNavbar() {
  const { IsLoggedIn, setIsLoggedIn, setUserRole, User } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userInitial = User?.username ? User.username.charAt(0).toUpperCase() : "";

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setDropdownOpen(false);
      setIsLoggedIn(false);
      setUserRole(null);
      navigate("/");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Improved isActive function
  const isActive = (path) => {
    const currentPath = location.pathname;
    
    // Handle home route
    if (path === '/doctor-dashboard' || path === '/doctor-dashboard/') {
      return currentPath === '/doctor-dashboard' || currentPath === '/doctor-dashboard/';
    }
    
    // Handle exact match or starts with
    if (currentPath === path) return true;
    if (currentPath.startsWith(path + '/')) return true;
    
    return false;
  };

  // Main Navigation Links - Uniform structure
  const mainNavLinks = [
    { 
      title: 'Home', 
      path: '/doctor-dashboard/', 
      icon: Home,
      exact: true
    },
    { 
      title: 'Appointments', 
      path: '/doctor-dashboard/appointment-services', 
      icon: Calendar
    },
    { 
      title: 'Patient Records', 
      path: '/doctor-dashboard/patient-records', 
      icon: FileText
    }
  ];

  // Quick Access Links for overview sections
  const quickAccessLinks = [
    { 
      title: 'Appointments Overview', 
      path: '/doctor-dashboard/booked-appointments', 
      desc: 'View & manage all appointments', 
      icon: ClipboardList 
    },
    { 
      title: 'Records Overview', 
      path: '/doctor-dashboard/records', 
      desc: 'Access medical histories', 
      icon: FileText 
    }
  ];

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
        <Link 
          to="/doctor-dashboard/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
          >
            <Stethoscope className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex items-baseline">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Hospi
            </span>
            <span className="text-2xl font-black text-gray-900">Tex</span>
          </div>
        </Link>
      </div>

      {/* Scrollable Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 min-h-0">
        {/* Main Navigation */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
            Navigation
          </h3>
          <div className="space-y-1">
            {mainNavLinks.map((link, idx) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
                    active
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    active ? 'text-white' : 'text-gray-500 group-hover:text-emerald-600'
                  }`} />
                  <span className="text-sm">{link.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Notification Bell */}
        {IsLoggedIn && (
          <div className="px-4 mb-6">
            <div className="px-4">
              <NotificationBell />
            </div>
          </div>
        )}

        {/* Quick Access Section */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
            Quick Access
          </h3>
          <div className="space-y-1">
            {quickAccessLinks.map((link, idx) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all group ${
                    active
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    active ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${
                      active ? 'text-emerald-900' : 'text-gray-700'
                    }`}>
                      {link.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile & Logout - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
        {IsLoggedIn && userInitial && (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive('/doctor-dashboard/profile') 
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{User?.username || 'Doctor'}</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 mb-2 w-full bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 z-50"
                >
                  <Link
                    to="/doctor-dashboard/profile"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    View Profile
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
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Fixed Height, Scrollable */}
      <aside className="hidden lg:flex lg:static w-72 bg-white shadow-2xl flex-col border-r border-gray-200 h-screen overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Slides In */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col border-r border-gray-200 overflow-hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default DoctorNavbar;
