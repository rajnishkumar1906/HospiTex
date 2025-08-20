import React from 'react';
import { Link } from 'react-router-dom';

function DiagnosticNavbar() {
  return (
    <nav className="w-full shadow-md bg-gradient-to-r from-indigo-600 to-white fixed top-0 z-50 px-10 py-5">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <p className="text-white text-3xl font-bold">Hospi</p>
          <p className="text-indigo-900 text-3xl font-bold">Tex</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-row items-center space-x-6">
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
            to="/diagnostic-dashboard/profile"
            className="text-indigo-900 font-medium px-2 py-2 transition duration-200 hover:text-indigo-700 hover:scale-105"
          >
            Profile
          </Link>

          <Link
            to="/diagnostic-dashboard/contacts"
            className="text-indigo-900 font-medium px-2 py-2 transition duration-200 hover:text-indigo-700 hover:scale-105"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default DiagnosticNavbar;
