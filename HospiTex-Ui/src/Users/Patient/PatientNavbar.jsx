import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Auth/AppContext';

function PatientNavbar() {
  const { IsLoggedIn, setIsLoggedIn, UserRole, setUserRole, User } = useContext(AppContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Use username instead of name
  const userInitial = User?.username ? User.username.charAt(0).toUpperCase() : '';

  const handleLogout = () => {
    setDropdownOpen(false)
    setIsLoggedIn(false);
    setUserRole(''); // clear role
    navigate('/');
  };

  return (
    <nav className="w-full shadow-md bg-gradient-to-l from-white to-blue-600 fixed top-0 z-50 px-10 py-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <p className="text-white text-3xl font-bold">Hospi</p>
          <p className="text-blue-900 text-3xl font-bold">Tex</p>
        </div>

        <div className="flex items-center space-x-6 relative">
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

          {IsLoggedIn && userInitial && (
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-lg cursor-pointer hover:scale-105 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userInitial}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <Link
                    to="/patient-dashboard/patientprofile"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link 
                    to="/patient-dashboard/appointment-history"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Appointments</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
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

export default PatientNavbar;
