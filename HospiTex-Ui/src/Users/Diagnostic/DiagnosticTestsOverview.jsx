import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DiagnosticTestsOverview = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 sm:px-10 lg:px-20 py-24 flex items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-purple-800 leading-tight">
            Manage Diagnostic Tests
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-2xl">
            Keep track of <span className="font-semibold text-purple-700">lab tests</span>, 
            upcoming bookings, and completed procedures. Provide accurate 
            diagnostics for patient treatment planning.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-3 pl-2 text-base sm:text-lg">
            <li>View scheduled test bookings</li>
            <li>Update completed test statuses</li>
            <li>Assign patients to labs</li>
            <li>Maintain test history logs</li>
            <li>Download test result copies</li>
          </ul>

          <Link
            to="/diagnostic-dashboard/tests-services"
            className="inline-block bg-purple-700 text-white px-8 py-4 rounded-xl text-lg shadow hover:bg-purple-800 transition duration-300"
          >
            View Full Tests
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
            src="/Pictures/diagnostic-tests.png"
            alt="Diagnostic Tests"
            className="w-full max-w-lg rounded-xl shadow-xl object-cover border border-purple-100"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default DiagnosticTestsOverview;
