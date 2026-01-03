import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, Edit, ArrowRight, ClipboardList } from 'lucide-react';

const DoctorPatientRecordsOverview = () => {
  const features = [
    { icon: FileText, text: "View full medical histories" },
    { icon: Calendar, text: "Track last visit dates" },
    { icon: User, text: "Access patient conditions instantly" },
    { icon: Edit, text: "Update and add notes quickly" },
    { icon: ClipboardList, text: "Plan follow-up visits effectively" }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 px-4 sm:px-10 lg:px-20 py-24 flex items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center relative order-2 lg:order-1"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-blue-500 rounded-2xl blur-2xl opacity-20"></div>
            <img
              src="/Pictures/records.png"
              alt="Patient Records"
              className="w-full max-w-lg rounded-2xl shadow-2xl object-cover relative z-10"
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 order-1 lg:order-2"
        >
          <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
            Patient Management
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Manage <span className="text-emerald-600">Patient Records</span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            Keep track of <span className="font-semibold text-emerald-700">medical histories</span>, 
            treatment plans, and visit logs — all in one place. Easily review and update patient 
            data for better care and improved treatment outcomes.
          </p>

          <ul className="space-y-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-teal-600" />
                  </div>
                  <span>{feature.text}</span>
                </motion.li>
              );
            })}
          </ul>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/doctor-dashboard/patient-records"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              View Full Patient Records
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorPatientRecordsOverview;
