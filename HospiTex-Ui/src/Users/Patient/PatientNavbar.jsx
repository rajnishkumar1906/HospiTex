import React from 'react';
import { Link } from 'react-router-dom';

function PatientNavbar() {
  return (
    <nav className="w-full shadow-md bg-gradient-to-l from-white to-blue-600 fixed top-0 z-50 px-10 py-5">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <p className="text-white text-3xl font-bold">Hospi</p>
          <p className="text-blue-900 text-3xl font-bold">Tex</p>
        </div>

        <div className="flex flex-row items-center space-x-6">

          <Link
            to="/patient-dashboard/"
            className="text-blue-800 font-medium px-2 py-2 transition duration-200 hover:text-blue-900 hover:scale-105"
          >
            Home
          </Link>

          <Link
            to="/patient-dashboard/contacts"
            className="text-blue-800 font-medium px-2 py-2 transition duration-200 hover:text-blue-900 hover:scale-105"
          >
            Contact
          </Link>

          <Link
            to="/patient-dashboard/userprofile"
            className="text-blue-800 font-medium px-2 py-2 transition duration-200 hover:text-blue-900 hover:scale-105"
          >
            Profile
          </Link>
          
        </div>
      </div>
    </nav>
  );
}

export default PatientNavbar;
