// src/components/DoctorDashboard/DoctorNavbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Auth/AppContext";

function DoctorNavbar() {
  const { IsLoggedIn, setIsLoggedIn, UserRole, setUserRole, User } = useContext(AppContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userInitial = User?.username ? User.username.charAt(0).toUpperCase() : "";

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("Patient"); // optional: reset role
    navigate("/");
  };

  return (
    <nav className="w-full shadow-md bg-gradient-to-r from-green-600 to-white fixed top-0 z-50 px-10 py-5">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <p className="text-white text-3xl font-bold">Hospi</p>
          <p className="text-green-900 text-3xl font-bold">Tex</p>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 relative">
          <Link
            to="/doctor-dashboard/"
            className="text-green-900 font-medium px-2 py-2 transition duration-200 hover:text-green-800 hover:scale-105"
          >
            Home
          </Link>

          <Link
            to="/doctor-dashboard/doctor-contacts"
            className="text-green-900 font-medium px-2 py-2 transition duration-200 hover:text-green-800 hover:scale-105"
          >
            Contact
          </Link>

          {/* Profile Dropdown */}
          {IsLoggedIn && userInitial && (
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center font-bold text-lg cursor-pointer hover:scale-105 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userInitial}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <Link
                    to="/doctor-dashboard/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-green-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100"
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

export default DoctorNavbar;
