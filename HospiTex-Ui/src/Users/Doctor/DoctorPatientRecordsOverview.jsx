import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DoctorPatientRecordsOverview = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 px-4 sm:px-10 lg:px-20 py-24 flex items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-green-800 leading-tight">
            Manage Patient Records
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-2xl">
            Keep track of <span className="font-semibold text-green-700">medical histories</span>, 
            treatment plans, and visit logs — all in one place. Easily review and update patient 
            data for better care and improved treatment outcomes.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-3 pl-2 text-base sm:text-lg">
            <li>View full medical histories</li>
            <li>Track last visit dates</li>
            <li>Access patient conditions instantly</li>
            <li>Update and add notes quickly</li>
            <li>Plan follow-up visits effectively</li>
          </ul>

          <Link
            to="/doctor-dashboard/patient-records"
            className="inline-block bg-green-700 text-white px-8 py-4 rounded-xl text-lg shadow hover:bg-green-800 transition duration-300"
          >
            View Full Patient Records
          </Link>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <img
            src="/Pictures/records.png"
            alt="Patient Records"
            className="w-full max-w-lg rounded-xl shadow-xl object-cover border border-green-100"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorPatientRecordsOverview;
