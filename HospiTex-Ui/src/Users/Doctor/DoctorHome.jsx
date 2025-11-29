import React from 'react';
import { Link } from 'react-router-dom';

function DoctorHome() {
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-green-100 to-green-200 px-6 py-16 flex flex-col justify-center">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center w-full">
        {/* Text */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-green-800 leading-tight">
            Welcome Back, Doctor!
          </h1>
          <p className="text-lg text-gray-700">
            Here’s a quick overview of your day and important updates.
          </p>
        </div>

        {/* Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/Pictures/doctor-dashboard.png"
            alt="Doctor Dashboard"
            className="w-full max-w-md rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105">
          <h2 className="text-2xl font-semibold text-green-900 mb-2">Today's Appointments</h2>
          <p className="text-green-800 text-lg">Review your live schedule</p>
          <Link
            to="/doctor-dashboard/appointment-services"
            className="mt-4 inline-block text-sm text-green-700 hover:underline"
          >
            View Appointments
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105">
          <h2 className="text-2xl font-semibold text-green-900 mb-2">Pending Lab Reports</h2>
          <p className="text-green-800 text-lg">Track diagnostics awaiting review</p>
          <Link
            to="/doctor-dashboard/lab-reports"
            className="mt-4 inline-block text-sm text-green-700 hover:underline"
          >
            View Lab Reports
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105">
          <h2 className="text-2xl font-semibold text-green-900 mb-2">Messages</h2>
          <p className="text-green-800 text-lg">Follow up on latest updates</p>
          <Link
            to="/doctor-dashboard/messages"
            className="mt-4 inline-block text-sm text-green-700 hover:underline"
          >
            View Messages
          </Link>
        </div>
      </div>

      {/* Quick Access */}
      <div className="mt-16 w-full text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-8">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Appointments', path: '/doctor-dashboard/booked-appointments' },
            { title: 'Patient Records', path: '/doctor-dashboard/records' },
            { title: 'contacts', path: '/doctor-dashboard/doctor-contacts' },
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
