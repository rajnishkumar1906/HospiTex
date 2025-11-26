import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Diagnostic = () => {
  const features = [
    {
      title: 'Pathology Lab',
      description: 'Comprehensive blood tests, urine analysis & more.',
      icon: '🧪'
    },
    {
      title: 'Radiology',
      description: 'X-ray, MRI, CT-Scan with modern digital imaging.',
      icon: '📡'
    },
    {
      title: 'Cardiology Tests',
      description: 'ECG, Echo, and stress tests performed with accuracy.',
      icon: '❤️'
    },
  ];

  const stats = [
    { number: '50,000+', label: 'Tests Conducted' },
    { number: '24/7', label: 'Diagnostic Lab Support' },
    { number: 'ISO Certified', label: 'International Standards' }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 px-6 py-16">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Precision Diagnostics
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              HospiTex <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Diagnostics</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Experience world-class diagnostic facilities with 24/7 support, instant reporting, 
              and accurate results delivered by cutting-edge technology.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/patient-dashboard/diagnostic-services"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-lg"
            >
              Explore Services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-lg opacity-20"></div>
          <img
            src="/Pictures/diag.png"
            alt="Diagnostic"
            className="relative w-full max-w-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 border-8 border-white"
          />
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="max-w-6xl mx-auto mb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300 hover:scale-105"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="max-w-5xl mx-auto mb-20"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-inner p-12 border border-blue-200">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">HospiTex?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</p>
                  <p className="text-gray-700 font-semibold">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-700 rounded-3xl p-12 shadow-2xl text-center text-white">
          <h4 className="text-3xl font-bold mb-4">Need a Diagnostic Test?</h4>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Book your diagnostic test today. Quick, simple, reliable, and accurate results guaranteed.
          </p>
          <Link
            to="/patient-dashboard/patientReg"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Register Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Diagnostic;