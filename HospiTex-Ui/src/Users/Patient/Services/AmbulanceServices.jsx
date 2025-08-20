import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Basic Life Support',
    description: 'Equipped for non-emergency patient transport with trained paramedics.',
  },
  {
    title: 'Advanced Life Support',
    description: 'For critical patients needing cardiac monitoring and life support.',
  },
  {
    title: 'Neonatal Ambulance',
    description: 'Specialized ambulance for safe transport of newborns with NICU setup.',
  },
  {
    title: 'ICU on Wheels',
    description: 'Mobile ICU with ventilators and advanced critical care equipment.',
  },
  {
    title: 'Patient Transfer',
    description: 'Comfortable long-distance patient transfer between hospitals or cities.',
  },
];

const AmbulanceServices = () => {
  return (
    <section className="bg-gradient-to-br from-white to-red-50 min-h-screen px-4 md:px-12 py-16 space-y-16">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <h1 className="text-5xl font-extrabold text-red-700">Ambulance Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          HospiTex provides 24/7 emergency ambulance services with fast response, trained professionals, and world-class facilities. Your safety is our priority.
        </p>
      </motion.div>

      {/* Services List */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-red-600 mb-3">{service.title}</h3>
            <p className="text-gray-700">{service.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-md p-8 max-w-5xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">Why Choose HospiTex Ambulance?</h2>
        <ul className="space-y-4 text-gray-700 list-disc list-inside">
          <li>24/7 emergency response</li>
          <li>Highly trained medical staff</li>
          <li>Fully equipped ambulances</li>
          <li>Real-time GPS tracking</li>
          <li>Fast city & inter-city transfers</li>
        </ul>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-extrabold text-red-700">Need Emergency Help?</h2>
        <p className="text-lg text-gray-600">Call our 24x7 ambulance helpline or book instantly online.</p>
        <Link
          to="/patient-dashboard/contact"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition"
        >
          Book Ambulance Now
        </Link>
      </motion.div>

      {/* Optional Testimonial */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 text-center"
      >
        <p className="text-xl text-gray-700 italic">
          “HospiTex ambulance service saved my father’s life. The staff was professional and extremely fast!”
        </p>
        <h4 className="mt-4 font-bold text-gray-800">— A grateful patient’s family</h4>
      </motion.div>

    </section>
  );
};

export default AmbulanceServices;
