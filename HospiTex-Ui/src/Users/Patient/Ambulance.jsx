import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Ambulance = () => {
  const features = [
    "Advanced Life Support (ALS) Units",
    "GPS Tracked for Fastest Arrival",
    "Emergency Medical Technicians Onboard",
    "Available in Urban & Rural Locations",
    "24/7 Quick Dispatch Service"
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-orange-100 px-6 md:px-12 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        
        {/* Left Content Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          {/* Emergency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg"
          >
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold text-sm uppercase tracking-wider">Emergency Service</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              24/7 Emergency <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Ambulance</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              HospiTex provides fast, reliable, and fully equipped ambulance services to ensure immediate medical attention when it matters most.
            </p>
          </div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-lg font-medium group-hover:text-gray-900 transition-colors">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="pt-4"
          >
            <Link
              to="/patient-dashboard/ambulance-services"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              View Ambulance Services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center"
        >
          {/* Background Decorations */}
          <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
          
          {/* Main Image Container */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -inset-6 bg-gradient-to-r from-red-400 to-orange-400 rounded-3xl blur-lg opacity-30"
            ></motion.div>
            
            <motion.img
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              src="/Pictures/ambulance.png"
              alt="HospiTex Emergency Ambulance"
              className="relative w-full max-w-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 object-cover border-8 border-white"
            />
            
            {/* Floating Emergency Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
              className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border border-red-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-red-700">LIVE TRACKING</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
              className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border border-orange-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-orange-700">24/7 ACTIVE</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Emergency Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="text-center mt-24"
      >
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-red-200">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </motion.div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need Immediate Medical Help?
          </h3>
          <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Call our 24/7 emergency line or book an ambulance online now for immediate assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/patient-dashboard/contacts"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Request Ambulance Now
            </Link>
            
            <div className="inline-flex items-center justify-center gap-3 border-2 border-red-300 text-red-700 px-8 py-4 rounded-2xl hover:border-red-500 hover:text-red-800 transition-all duration-300 font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call: 911 / 108
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Ambulance;