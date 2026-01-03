import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, Users, ArrowRight, CalendarCheck } from 'lucide-react';

const DoctorAppointmentsOverview = () => {
  const features = [
    { icon: Calendar, text: "View and confirm patient bookings" },
    { icon: Clock, text: "Reschedule or cancel appointments" },
    { icon: Users, text: "Access patient details instantly" },
    { icon: CheckCircle, text: "Mark completed consultations" },
    { icon: CalendarCheck, text: "Track follow-up visits" }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 px-6 md:px-20 py-20 flex items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            Appointment Management
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Manage Your <span className="text-emerald-600">Appointments</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Get a clear overview of today's schedule, upcoming patient visits, and pending consultations —
            all in one place with real-time updates.
          </p>

          <ul className="space-y-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-emerald-600" />
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
              to="/doctor-dashboard/appointment-services"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              View Full Appointment Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center relative"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-2xl opacity-20"></div>
            <img
              src="/Pictures/appointment.png"
              alt="Doctor Appointments"
              className="w-full max-w-md rounded-2xl shadow-2xl object-cover relative z-10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorAppointmentsOverview;
