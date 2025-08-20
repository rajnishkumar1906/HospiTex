import React from 'react';
import { Link } from 'react-router-dom';

const Diagnostic = () => {
  const features = [
    {
      title: 'Pathology Lab',
      description: 'Comprehensive blood tests, urine analysis & more.',
    },
    {
      title: 'Radiology',
      description: 'X-ray, MRI, CT-Scan with modern digital imaging.',
    },
    {
      title: 'Cardiology Tests',
      description: 'ECG, Echo, and stress tests performed with accuracy.',
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-100 to-white px-8 py-12 flex flex-col items-center">

      {/* 🎯 Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl w-full mb-16">
        <div className="md:w-1/2 space-y-6 mt-10 md:mt-0">
          <h2 className="text-5xl font-extrabold text-blue-800">HospiTex Diagnostics</h2>
          <p className="text-gray-700 text-lg">
            Experience world-class diagnostic facilities with 24/7 support and instant reporting.
          </p>
          <Link
            to="/patient-dashboard/diagnostic-services"
            className="inline-block bg-blue-700 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-800 transition"
          >
            Explore Services
          </Link>
        </div>
        <img
          src="/Pictures/diag.png"
          alt="Diagnostic"
          className="w-[400px] rounded-xl shadow-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
        {features.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl w-full text-center bg-blue-50 rounded-xl shadow-inner p-8 mb-16">
        <h3 className="text-2xl font-semibold text-blue-800 mb-6">Why Choose HospiTex?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-900 font-medium">
          <div>
            <p className="text-3xl font-bold">50,000+</p>
            <p>Tests Conducted</p>
          </div>
          <div>
            <p className="text-3xl font-bold">24/7</p>
            <p>Diagnostic Lab Support</p>
          </div>
          <div>
            <p className="text-3xl font-bold">ISO Certified</p>
            <p>International Standards</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-full text-white text-center py-10 rounded-xl max-w-5xl shadow-lg">
        <h4 className="text-2xl font-semibold mb-2">Need a test?</h4>
        <p className="mb-4">Book a diagnostic test today. Quick, simple & reliable.</p>
        <Link
          to="/patient-dashboard/patientReg"
          className="bg-white text-blue-800 font-semibold px-5 py-2 rounded-full hover:bg-blue-100 transition"
        >
          Register Now
        </Link>
      </div>

    </section>
  );
};

export default Diagnostic;
