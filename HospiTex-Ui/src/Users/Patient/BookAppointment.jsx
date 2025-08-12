import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookAppointment = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-100 to-teal-50 px-6 md:px-20 py-20 flex items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-800">
            Book Appointments Easily
          </h2>
          <p className="text-gray-700 text-lg md:text-xl">
            Choose from our network of top medical professionals and secure your spot in seconds. Avoid queues, stay informed, and manage your healthcare effortlessly.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Real-time doctor availability</li>
            <li>Instant booking confirmation</li>
            <li>Flexible rescheduling</li>
            <li>Reminders & follow-ups</li>
            <li>Video consultations available</li>
          </ul>

          <Link
            to="/patient-dashboard/appointment-services"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl shadow hover:bg-green-800 transition duration-300"
          >
            View Appointment Services
          </Link>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <img
            src="/Pictures/appointment.png"
            alt="Book Appointment"
            className="w-full max-w-md rounded-xl shadow-xl object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BookAppointment;
