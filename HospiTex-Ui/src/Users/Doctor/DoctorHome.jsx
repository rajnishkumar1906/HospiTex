import React from 'react';
import { Link } from 'react-router-dom';

function DoctorHome() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 px-6 py-16 flex flex-col justify-center">
      {/* Container max width and centered */}
      <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-green-800 leading-tight">
            Welcome Back, Doctor!
          </h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
            Here’s a quick overview of your day and important updates.
          </p>
        </div>

        {/* Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/Pictures/doctor-dashboard.png"  // adjust path as needed
            alt="Doctor Illustration"
            className="w-full max-w-md rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105 cursor-pointer">
          <h2 className="text-2xl font-semibold text-green-900 mb-2">Today's Appointments</h2>
          <p className="text-green-800 text-lg">8 Scheduled</p>
          <Link 
            to="/doctor-dashboard/appointments"
            className="mt-4 inline-block text-sm text-green-700 hover:underline"
          >
            View Appointments
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105 cursor-pointer">
          <h2 className="text-2xl font-semibold text-green-900 mb-2">Pending Lab Reports</h2>
          <p className="text-green-800 text-lg">3 Reports</p>
          <Link 
            to="/doctor-dashboard/lab-reports"
            className="mt-4 inline-block text-sm text-green-700 hover:underline"
          >
            View Lab Reports
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105 cursor-pointer">
          <h2 className="text-2xl font-semibold text-green-900 mb-2">Messages</h2>
          <p className="text-green-800 text-lg">5 Unread</p>
          <Link 
            to="/doctor-dashboard/messages"
            className="mt-4 inline-block text-sm text-green-700 hover:underline"
          >
            View Messages
          </Link>
        </div>
      </div>

      {/* Quick Actions or Links */}
      <div className="mt-16 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-8">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Appointments', path: '/doctor-dashboard/appointments' },
            { title: 'Patient Records', path: '/doctor-dashboard/patient-records' },
            { title: 'Profile', path: '/doctor-dashboard/profile' },
            { title: 'Settings', path: '/doctor-dashboard/settings' },
          ].map(service => (
            <Link
              key={service.title}
              to={service.path}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-green-700">{service.title}</h3>
              <p className="text-green-600 mt-2">Click to manage</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DoctorHome;
