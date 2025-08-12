import React from 'react';
import { Link } from 'react-router-dom';

function DoctorNavbar() {
  return (
    <nav className="w-full shadow-md bg-gradient-to-r from-green-600 to-white fixed top-0 z-50 px-10 py-5">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <p className="text-white text-3xl font-bold">Hospi</p>
          <p className="text-green-900 text-3xl font-bold">Tex</p>
        </div>

        <div className="flex flex-row items-center space-x-6">
          <Link
            to="/doctor-dashboard/"
            className="text-green-900 font-medium px-2 py-2 transition duration-200 hover:text-green-800 hover:scale-105"
          >
            Home
          </Link>

          <Link
            to="/doctor-dashboard/appointments"
            className="text-green-900 font-medium px-2 py-2 transition duration-200 hover:text-green-800 hover:scale-105"
          >
            Appointments
          </Link>

          <Link
            to="/doctor-dashboard/patient-records"
            className="text-green-900 font-medium px-2 py-2 transition duration-200 hover:text-green-800 hover:scale-105"
          >
            Patient Records
          </Link>

          <Link
            to="/doctor-dashboard/profile"
            className="text-green-900 font-medium px-2 py-2 transition duration-200 hover:text-green-800 hover:scale-105"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default DoctorNavbar;
