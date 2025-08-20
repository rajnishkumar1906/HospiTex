import React from "react";
import { Link } from "react-router-dom";

const DoctorPatientRecordsServices = () => {
  const services = [
    {
      title: "Complete Medical History",
      desc: "View and update the patient’s full medical background for accurate treatment planning.",
    },
    {
      title: "Condition Tracking",
      desc: "Monitor ongoing health issues and track improvements over time.",
    },
    {
      title: "Visit Logs",
      desc: "Quickly check previous visits, diagnoses, and prescriptions.",
    },
    {
      title: "Follow-Up Scheduling",
      desc: "Plan and manage upcoming consultations for better patient care.",
    },
    {
      title: "Search & Filters",
      desc: "Find patient records instantly with advanced search and filters.",
    },
    {
      title: "Secure Data Handling",
      desc: "Ensure patient data remains safe and compliant with medical privacy laws.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-white px-8 py-16">
      <h2 className="text-4xl font-extrabold text-green-800 mb-4 text-center">
        Patient Records Management Tools
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Powerful tools to help you manage patient information quickly, accurately, and securely.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((s, idx) => (
          <div
            key={idx}
            className="bg-white border border-green-200 rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-green-700 mb-2">{s.title}</h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Link to full records */}
      <div className="text-center mt-16">
        <Link
          to="/doctor-dashboard/patient-records-overview"
          className="bg-green-700 text-white px-8 py-3 rounded-full shadow hover:bg-green-800 transition duration-300"
        >
          Go to Patient Records
        </Link>
      </div>
    </section>
  );
};

export default DoctorPatientRecordsServices;
