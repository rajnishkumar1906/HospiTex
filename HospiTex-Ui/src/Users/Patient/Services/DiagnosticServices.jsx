import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const diagnosticList = [
  {
    title: 'Blood Tests',
    description: 'Comprehensive testing including CBC, sugar, cholesterol, and more.',
  },
  {
    title: 'MRI Scans',
    description: 'High-resolution imaging to detect abnormalities in organs and tissues.',
  },
  {
    title: 'CT Scans',
    description: 'Detailed cross-sectional imaging for fast diagnosis of injuries and issues.',
  },
  {
    title: 'Ultrasound',
    description: 'Safe, painless scans to monitor internal organs, pregnancy, and more.',
  },
  {
    title: 'X-Ray',
    description: 'Instant digital radiography for bone fractures and chest screenings.',
  },
  {
    title: 'ECG/EKG',
    description: 'Heart activity monitoring for arrhythmia, chest pain, and cardiac check-ups.',
  },
];

const DiagnosticServices = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white min-h-screen px-4 md:px-12 py-16 space-y-16">
      
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <h1 className="text-5xl font-extrabold text-blue-800">Diagnostic Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          At HospiTex, we provide accurate, affordable, and timely diagnostic services using state-of-the-art equipment and certified medical experts.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {diagnosticList.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-blue-700 mb-3">{service.title}</h3>
            <p className="text-gray-700">{service.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow p-8 max-w-5xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Why Choose HospiTex Diagnostics?</h2>
        <ul className="space-y-4 text-gray-700 list-disc list-inside">
          <li>Fully automated lab and digital imaging</li>
          <li>Certified pathologists and radiologists</li>
          <li>Same-day report delivery for most tests</li>
          <li>Affordable packages and home sample collection</li>
          <li>100% data privacy & accuracy guarantee</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-extrabold text-blue-800">Need a Test Today?</h2>
        <p className="text-lg text-gray-600">Book your diagnostic test now and get reports delivered digitally.</p>
        <Link
          to="/contact"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-full transition"
        >
          Book Diagnostic Test
        </Link>
      </motion.div>

    </section>
  );
};

export default DiagnosticServices;
