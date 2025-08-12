import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Ambulance = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-red-100 to-white px-6 md:px-12 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-red-700 leading-tight">
            24/7 Emergency Ambulance
          </h2>
          <p className="text-gray-700 text-lg md:text-xl">
            HospiTex provides fast, reliable, and fully equipped ambulance services to ensure immediate medical attention when it matters most.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li >Advanced Life Support (ALS) Units</li>
            <li >GPS Tracked for Fastest Arrival</li>
            <li >Emergency Medical Technicians Onboard</li>
            <li >Available in Urban & Rural Locations</li>
            <li >24/7 Quick Dispatch Service</li>
          </ul>

          <Link
            to="/patient-dashboard/ambulance-services"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition duration-300"
          >
            View Ambulance Services
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <img
            src="/Pictures/ambulance.png"
            alt="HospiTex Emergency Ambulance"
            className="w-full max-w-md rounded-xl shadow-xl object-cover"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-20"
      >
        <h3 className="text-3xl font-bold text-red-700 mb-4">Need Immediate Medical Help?</h3>
        <p className="text-gray-700 text-lg mb-6">Call our 24/7 emergency line or book an ambulance online now.</p>
        <Link
          to="/patient-dashboard/contacts"
          className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-4 text-lg font-semibold rounded-full transition"
        >
          Request Ambulance
        </Link>
      </motion.div>
    </section>
  );
};

export default Ambulance;