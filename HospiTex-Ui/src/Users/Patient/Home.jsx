import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-6 py-16 flex flex-col justify-center">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold text-blue-800 leading-tight">
            Welcome to HospiTex
          </h1>
          <p className="text-lg text-gray-700">
            A modern hospital management system with 24/7 support, online booking, AI chatbot Medibot, and more.
          </p>
          
          <Link 
            to="/patient-dashboard/appointment-booking"
            className="inline-block bg-blue-700 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-800 transition"
          >
            Book an Appointment
          </Link>
        </div>

        {/* Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img 
            src="/Pictures/hero-doctor.png" 
            alt="Doctor Hero" 
            className="w-full max-w-md rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Appointments', path: '/patient-dashboard/appointment-booking' },
            { title: 'Diagnostics', path: '/patient-dashboard/diagnostic' },
            { title: 'Ambulance', path: '/patient-dashboard/ambulance' },
            { title: 'Contact Us', path: '/patient-dashboard/contacts' },
          ].map((service) => (
            <Link 
              key={service.title}
              to={service.path}
              className="bg-white text-center p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-700">{service.title}</h3>
              <p className="text-gray-600 mt-2 font-semibold" >Go to service</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
