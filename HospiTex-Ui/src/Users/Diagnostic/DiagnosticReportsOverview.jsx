import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DiagnosticReportsOverview = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 sm:px-10 lg:px-20 py-24 flex items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 leading-tight">
            Manage Diagnostic Reports
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-2xl">
            Upload, organize, and review patient reports including{" "}
            <span className="font-semibold text-indigo-700">lab tests</span>, 
            scans, and imaging results. Ensure quick access and better 
            collaboration with doctors.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-3 pl-2 text-base sm:text-lg">
            <li>Upload lab test results</li>
            <li>Attach X-ray / MRI reports</li>
            <li>Search reports by patient ID</li>
            <li>Share reports with doctors</li>
            <li>Track uploaded history</li>
          </ul>

          <Link
            to="/diagnostic-dashboard/reports-services"
            className="inline-block bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg shadow hover:bg-indigo-800 transition duration-300"
          >
            View Full Reports
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
            src="/Pictures/manage-diagnostics.png"
            alt="Diagnostic Reports"
            className="w-full max-w-lg rounded-xl shadow-xl object-cover border border-indigo-100"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default DiagnosticReportsOverview;
