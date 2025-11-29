import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-6 py-20 flex flex-col justify-center">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto gap-12">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Your Health, Our Priority
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">HospiTex</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Experience modern healthcare with 24/7 support, seamless online booking, AI-powered Medibot assistance, and comprehensive medical services.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/patient-dashboard/appointment-booking"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              Book an Appointment
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link 
              to="/patient-dashboard/contacts"
              className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center relative">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-20"></div>
            <img 
              src="/Pictures/hero-doctor.png" 
              alt="Doctor Hero" 
              className="relative w-full max-w-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare services designed for your comfort and well-being
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              title: 'Appointments', 
              path: '/patient-dashboard/appointment-booking',
              icon: '📅',
              description: 'Book doctor appointments online'
            },
            { 
              title: 'Diagnostics', 
              path: '/patient-dashboard/diagnostic',
              icon: '🔬',
              description: 'Advanced diagnostic services'
            },
            { 
              title: 'Ambulance', 
              path: '/patient-dashboard/ambulance',
              icon: '🚑',
              description: 'Emergency ambulance services'
            },
            { 
              title: 'Contact Us', 
              path: '/patient-dashboard/contacts',
              icon: '📞',
              description: 'Get in touch with us'
            },
          ].map((service) => (
            <Link 
              key={service.title}
              to={service.path}
              className="group bg-white text-center p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:scale-105"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 font-medium">{service.description}</p>
              <div className="mt-4 inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                Explore
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-24 max-w-4xl mx-auto text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Why Choose HospiTex?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h4 className="font-semibold text-gray-900">24/7 Support</h4>
              <p className="text-sm">Round the clock medical assistance</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-gray-900">AI Medibot</h4>
              <p className="text-sm">Smart healthcare assistance</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900">Fast Service</h4>
              <p className="text-sm">Quick and efficient care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;