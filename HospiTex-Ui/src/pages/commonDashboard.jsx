import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {Stethoscope,FileText,Users,CheckCircle,Clock,Shield,Mail,Phone,
} from "lucide-react";
import { motion } from "framer-motion";

const CommonDashBoard = () => {
  const navigate = useNavigate();

  const portals = [
    {
      title: "Patient Portal",
      description:
        "Access your health records, book appointments, and manage reports.",
      image:
        "/Pictures/patient.png",
      path: "/patient-dashboard",
      color: "from-indigo-100 to-indigo-200",
    },
    {
      title: "Doctor Portal",
      description:
        "Manage patient consultations, view medical history, and collaborate.",
      image:
        "https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope-isolated-grey_651396-974.jpg",
      path: "/doctor-dashboard",
      color: "from-green-100 to-green-200",
    },
    {
      title: "Diagnostic Portal",
      description:
        "Upload lab reports, manage tests, and communicate with patients.",
      image:
        "/Pictures/diagnostic.png",
      path: "/diagnostic-dashboard",
      color: "from-purple-100 to-purple-200",
    },
  ];

  const features = [
    {
      title: "Trusted Doctors",
      desc: "Certified and experienced doctors at your service.",
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    },
    {
      title: "24/7 Service",
      desc: "Access medical support anytime, anywhere.",
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Secure Data",
      desc: "Your health records are private and encrypted.",
      icon: <Shield className="w-8 h-8 text-purple-600" />,
    },
  ];

  const contactInfo = {
    email: "support@hospitex.com",
    phone: "+1-234-567-8901",
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-green-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold text-indigo-900">
          HospiTex
        </Link>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition cursor-pointer"
        >
          Login / Sign Up
        </button>
      </nav>

      {/* Hero Section with Doctor Image */}
      <header className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 py-20 px-10 bg-gradient-to-br from-indigo-100 via-white to-green-100">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
            Welcome to HospiTex
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-xl">
            Your all-in-one healthcare platform connecting Patients, Doctors,
            and Diagnostic Centers.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-full shadow hover:shadow-lg transition cursor-pointer"
          >
            Get Started →
          </motion.button>
        </div>

        {/* Right Doctor Image */}
        <div className="flex justify-center">
          <img
            src="/Pictures/heroImage.png"
            alt="Patients, Doctor, and Diagnostic"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover"
          />
        </div>

      </header>

      {/* Portal Cards with Images */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-16">
        {portals.map((portal, i) => (
          <motion.button
            key={portal.title}
            onClick={() => navigate("/login")}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className={`rounded-2xl shadow-lg p-8 flex flex-col items-center text-center bg-gradient-to-br ${portal.color} hover:shadow-2xl transition cursor-pointer`}
          >
            <img
              src={portal.image}
              alt={portal.title}
              className="w-24 h-24 rounded-full object-cover mb-4 shadow-md"
            />
            <h2 className="text-2xl font-semibold text-indigo-900">
              {portal.title}
            </h2>
            <p className="mt-2 text-gray-700 text-sm">{portal.description}</p>
            <span className="mt-4 text-indigo-600 font-medium flex items-center gap-1">
              Enter →
            </span>
          </motion.button>
        ))}
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-10 relative">
        <h2 className="text-3xl font-bold text-center mb-10 text-indigo-900">
          Why Choose HospiTex?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-4 p-6 border rounded-xl bg-white/60 backdrop-blur-sm hover:shadow-xl transition"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-indigo-50 py-12 px-10 text-center rounded-xl mx-10 mb-10 shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-indigo-900">
          Get in Touch
        </h2>
        <p className="flex items-center justify-center gap-2 text-gray-700 mb-4">
          <Mail className="w-5 h-5 text-indigo-600" />{" "}
          <a
            href={`mailto:${contactInfo.email}`}
            className="hover:underline text-indigo-700"
          >
            {contactInfo.email}
          </a>
        </p>
        <p className="flex items-center justify-center gap-2 text-gray-700">
          <Phone className="w-5 h-5 text-indigo-600" />{" "}
          <a
            href={`tel:${contactInfo.phone}`}
            className="hover:underline text-indigo-700"
          >
            {contactInfo.phone}
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm border-t bg-white">
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-2">
          <Link to="/privacy" className="hover:text-indigo-600">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-indigo-600">
            Terms of Service
          </Link>
        </div>
        <p>© {new Date().getFullYear()} HospiTex. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CommonDashBoard;
