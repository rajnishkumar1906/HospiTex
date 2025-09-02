import React, { useState } from "react";
import { Link } from "react-router-dom";

const AppointmentServices = () => {
  const [filter, setFilter] = useState("all");

  const services = [
    { title: "General Checkups", desc: "Routine health examinations to maintain overall wellness.", category: "general" },
    { title: "Specialist Consultations", desc: "Consult top specialists like Cardiologists, Neurologists, and Orthopedics.", category: "specialist" },
    { title: "Follow-up Appointments", desc: "Easily schedule follow-ups after your previous consultation or surgery.", category: "followup" },
    { title: "Online Consultations", desc: "Book secure video/audio call appointments with doctors from home.", category: "online" },
  ];

  const doctors = [
    { name: "Dr. Ramesh Sharma", specialty: "General Physician", category: "general", experience: "10+ years", img: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Dr. Anita Kapoor", specialty: "Cardiologist", category: "specialist", experience: "12+ years", img: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Dr. Sunil Verma", specialty: "Neurologist", category: "specialist", experience: "15+ years", img: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "Dr. Priya Nair", specialty: "Orthopedic Surgeon", category: "specialist", experience: "8+ years", img: "https://randomuser.me/api/portraits/women/4.jpg" },
    { name: "Dr. Kavita Joshi", specialty: "Pediatrician", category: "followup", experience: "6+ years", img: "https://randomuser.me/api/portraits/women/5.jpg" },
    { name: "Dr. Rajeev Singh", specialty: "Online Consultant", category: "online", experience: "7+ years", img: "https://randomuser.me/api/portraits/men/6.jpg" },
  ];


  const categories = [
    { key: "general", label: "General" },
    { key: "specialist", label: "Specialist" },
    { key: "followup", label: "Follow-up" },
    { key: "online", label: "Online" },
  ];

  const filteredServices = filter === "all" ? services : services.filter((s) => s.category === filter);
  const filteredDoctors = filter === "all" ? doctors : doctors.filter((d) => d.category === filter);

  return (
    <section className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-white">
      {/* Header */}
      <div className="px-8 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4 drop-shadow-md">
          Our Appointment Services
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg md:text-xl">
          HospiTex provides quick and easy appointment options. Choose a service, view available doctors, and book your consultation in just a few clicks.
        </p>
      </div>

      {/* Category Buttons */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap px-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-6 py-2 rounded-full font-medium shadow-md transition ${filter === cat.key
                ? "bg-green-700 text-white"
                : "bg-white border border-green-300 text-green-700 hover:bg-green-50"
              }`}
          >
            {cat.label}
          </button>
        ))}
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-full font-medium shadow-md transition ${filter === "all"
              ? "bg-green-700 text-white"
              : "bg-white border border-green-300 text-green-700 hover:bg-green-50"
            }`}
        >
          Show All
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto px-8 mb-16">
        {/* Services Column */}
        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-6 text-center md:text-left">Services Available</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((s, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No services available for this category.</p>
            )}
          </div>
        </div>

        {/* Doctors Column */}
        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-6 text-center md:text-left">Available Doctors</h3>
          <div className="grid grid-cols-1 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((d, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition flex items-center gap-4">
                  <img src={d.img} alt={d.name} className="w-16 h-16 rounded-full object-cover border border-green-200" />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-green-700">{d.name}</h4>
                    <p className="text-gray-600 text-sm">{d.specialty}</p>
                    <p className="text-gray-500 text-xs">Experience: {d.experience}</p>
                  </div>
                  <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
                    Book
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No doctors available for this category.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">© {new Date().getFullYear()} HospiTex. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default AppointmentServices;
