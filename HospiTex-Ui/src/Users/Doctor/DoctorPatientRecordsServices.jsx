import React from "react";
import { Link } from "react-router-dom";
import { FaNotesMedical, FaClipboardList, FaCalendarCheck, FaSearch, FaLock } from "react-icons/fa";

const DoctorPatientRecordsServices = () => {
  const services = [
    {
      title: "Complete Medical History",
      desc: "View and update the patient’s full medical background for accurate treatment planning.",
      icon: <FaNotesMedical className="text-green-600 w-8 h-8 mb-3" />,
    },
    {
      title: "Condition Tracking",
      desc: "Monitor ongoing health issues and track improvements over time.",
      icon: <FaClipboardList className="text-green-600 w-8 h-8 mb-3" />,
    },
    {
      title: "Visit Logs",
      desc: "Quickly check previous visits, diagnoses, and prescriptions.",
      icon: <FaCalendarCheck className="text-green-600 w-8 h-8 mb-3" />,
    },
    {
      title: "Follow-Up Scheduling",
      desc: "Plan and manage upcoming consultations for better patient care.",
      icon: <FaCalendarCheck className="text-green-600 w-8 h-8 mb-3" />,
    },
    {
      title: "Search & Filters",
      desc: "Find patient records instantly with advanced search and filters.",
      icon: <FaSearch className="text-green-600 w-8 h-8 mb-3" />,
    },
    {
      title: "Secure Data Handling",
      desc: "Ensure patient data remains safe and compliant with medical privacy laws.",
      icon: <FaLock className="text-green-600 w-8 h-8 mb-3" />,
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-white px-8 py-16">
      {/* Header */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4 text-center drop-shadow-md">
        Patient Records Management Tools
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg md:text-xl">
        Powerful tools to help you manage patient information quickly, accurately, and securely.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((s, idx) => (
          <div
            key={idx}
            className="bg-white border border-green-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center text-center"
          >
            {s.icon}
            <h3 className="text-xl font-semibold text-green-700 mb-2">{s.title}</h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Link to Full Records */}
      <div className="text-center mt-16">
        <Link
          to="/doctor-dashboard/patient-records-overview"
          className="bg-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-800 transition duration-300 transform hover:scale-105"
        >
          Go to Patient Records
        </Link>
      </div>
    </section>
  );
};

export default DoctorPatientRecordsServices;
