import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stethoscope, FileText, Users, CheckCircle, Clock, Shield, Mail, Phone, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const CommonDashBoard = () => {
  const navigate = useNavigate();

  const portals = [
    {
      title: "Patient Portal",
      description: "Access your health records, book appointments, and manage reports.",
      image: "/Pictures/patient.png",
      path: "/patient-dashboard",
      color: "from-blue-500 to-cyan-500",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Doctor Portal",
      description: "Manage patient consultations, view medical history, and collaborate.",
      image: "https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope-isolated-grey_651396-974.jpg",
      path: "/doctor-dashboard",
      color: "from-emerald-500 to-green-500",
      icon: <Stethoscope className="w-6 h-6" />
    },
    {
      title: "Diagnostic Portal",
      description: "Upload lab reports, manage tests, and communicate with patients.",
      image: "/Pictures/diagnostic.png",
      path: "/diagnostic-dashboard",
      color: "from-purple-500 to-violet-500",
      icon: <FileText className="w-6 h-6" />
    },
  ];

  const features = [
    { 
      title: "Trusted Doctors", 
      desc: "Certified and experienced doctors at your service.", 
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      stat: "500+ Doctors"
    },
    { 
      title: "24/7 Service", 
      desc: "Access medical support anytime, anywhere.", 
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      stat: "Always Available"
    },
    { 
      title: "Secure Data", 
      desc: "Your health records are private and encrypted.", 
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      stat: "100% Secure"
    },
  ];

  const stats = [
    { number: "50K+", label: "Patients Served" },
    { number: "500+", label: "Expert Doctors" },
    { number: "100+", label: "Diagnostic Centers" },
    { number: "24/7", label: "Support Available" }
  ];

  const contactInfo = { email: "support@hospitex.com", phone: "+1-234-567-8901" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col">
      
      {/* Enhanced Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            HospiTex
          </span>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.nav>

      {/* Enhanced Hero Section */}
      <section className="relative px-6 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-cyan-400/10"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left space-y-6"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Your Health
              </span>
              <br />
              <span className="text-gray-900">Our Priority</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-xl leading-relaxed"
            >
              Comprehensive healthcare platform connecting patients, doctors, and diagnostic centers for seamless medical care.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300 font-semibold"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <img
                src="/Pictures/heroImage.png"
                alt="Healthcare Professionals"
                className="relative w-full max-w-2xl rounded-2xl shadow-2xl border-8 border-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="px-6 py-16 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Portal Cards */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Portal</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access specialized healthcare services tailored to your needs
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal, i) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate("/login")}
              className="group cursor-pointer"
            >
              <div className={`relative rounded-3xl p-8 bg-gradient-to-br ${portal.color} shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center text-white`}>
                
                {/* Icon */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className={`bg-gradient-to-r ${portal.color} rounded-xl w-10 h-10 flex items-center justify-center`}>
                    {portal.icon}
                  </div>
                </div>

                {/* Image */}
                <div className="w-24 h-24 rounded-2xl bg-white/20 p-2 mt-4 mb-6">
                  <img
                    src={portal.image}
                    alt={portal.title}
                    className="w-full h-full rounded-2xl object-cover shadow-lg"
                  />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black mb-3">{portal.title}</h3>
                <p className="text-white/90 leading-relaxed mb-6 flex-grow">
                  {portal.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-white/90 font-semibold group-hover:text-white transition-colors">
                  Enter Portal
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-slate-100 to-blue-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">HospiTex?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience healthcare redefined with our cutting-edge platform
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl border border-white/50 transition-all duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{feature.desc}</p>
              <div className="text-sm font-semibold text-blue-600">{feature.stat}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl lg:text-4xl font-black mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals and patients using HospiTex
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <div className="flex items-center gap-3 text-blue-100">
              <Mail className="w-5 h-5" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors font-medium">
                {contactInfo.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <Phone className="w-5 h-5" />
              <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors font-medium">
                {contactInfo.phone}
              </a>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold flex items-center gap-2 mx-auto"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">HospiTex</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors font-medium">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors font-medium">Terms of Service</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors font-medium">Contact</Link>
            </div>
          </div>
          
          <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
            <p>© {new Date().getFullYear()} HospiTex Healthcare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommonDashBoard;