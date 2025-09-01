import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Auth/AppContext';

function DiagnosticNavbar() {
  const { IsLoggedIn, setIsLoggedIn, UserRole, setUserRole, User } = useContext(AppContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userInitial = User?.username ? User.username.charAt(0).toUpperCase() : '';

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(''); // reset role
    navigate('/');
  };

  return (
    <nav className="w-full shadow-md bg-gradient-to-r from-indigo-600 to-white fixed top-0 z-50 px-10 py-5">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <p className="text-white text-3xl font-bold">Hospi</p>
          <p className="text-indigo-900 text-3xl font-bold">Tex</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-row items-center space-x-6 relative">
          <Link
            to="/diagnostic-dashboard"
            className="text-indigo-900 font-medium px-2 py-2 transition duration-200 hover:text-indigo-700 hover:scale-105"
          >
            Home
          </Link>

          <Link
            to="/diagnostic-dashboard/reports-services"
            className="text-indigo-900 font-medium px-2 py-2 transition duration-200 hover:text-indigo-700 hover:scale-105"
          >
            Reports
          </Link>

          <Link
            to="/diagnostic-dashboard/tests-services"
            className="text-indigo-900 font-medium px-2 py-2 transition duration-200 hover:text-indigo-700 hover:scale-105"
          >
            Tests
          </Link>

          <Link
            to="/diagnostic-dashboard/contacts"
            className="text-indigo-900 font-medium px-2 py-2 transition duration-200 hover:text-indigo-700 hover:scale-105"
          >
            Contact
          </Link>

          {/* Profile Avatar with Dropdown */}
          {IsLoggedIn && userInitial && (
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-lg cursor-pointer hover:scale-105 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userInitial}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <Link
                    to="/diagnostic-dashboard/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DiagnosticNavbar;
