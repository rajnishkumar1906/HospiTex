import React, { useState, useContext } from "react";
import DoctorCard from "../../../components/DoctorCard";
import { AppContext } from "../../../auth/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const AppointmentServices = () => {
  const { services, doctors, bookedAppointments, setBookedAppointments } = useContext(AppContext);
  const [filter, setFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookAppointment, setBookAppointment] = useState(false);

  const filteredDoctors = filter === "all" ? doctors : doctors.filter(d => d.category === filter);
  const filteredServices = filter === "all" ? services : services.filter(s => s.category === filter);

  const categories = [
    { key: "all", label: "Show All", icon: "🌐" },
    { key: "general", label: "General", icon: "👨‍⚕️" },
    { key: "specialist", label: "Specialist", icon: "🎯" },
    { key: "followup", label: "Follow-up", icon: "📋" },
    { key: "online", label: "Online", icon: "💻" }
  ];

  return (
    <section className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {!bookAppointment ? (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="px-8 py-12 text-center"
              >
                <div className="max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
                  >
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                    Professional Healthcare Services
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Appointment Services</span>
                  </h1>
                  <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Choose a service, view available doctors, and book your consultation with top medical professionals.
                  </p>
                </div>
              </motion.div>

              {/* Category Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-3 mb-16 flex-wrap px-8"
              >
                {categories.map(cat => (
                  <motion.button
                    key={cat.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(cat.key)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${
                      filter === cat.key
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-200"
                        : "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    {cat.label}
                  </motion.button>
                ))}
              </motion.div>

              {/* Services & Doctors */}
              <div className="max-w-7xl mx-auto px-8 mb-16">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  {/* Services Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center xl:text-left">
                      Services <span className="text-emerald-600">Available</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredServices.map((s, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 group cursor-pointer"
                        >
                          <h3 className="text-xl font-bold text-emerald-700 mb-3 group-hover:text-emerald-800 transition-colors">
                            {s.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Doctors Section */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center xl:text-left">
                      Available <span className="text-teal-600">Doctors</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4">
                      {filteredDoctors.map((d, index) => (
                        <motion.div
                          key={d.doctor_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-100 group"
                        >
                          <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="relative">
                              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                              <img
                                src={d.img}
                                alt={d.name}
                                className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                              />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <h4 className="text-lg font-bold text-gray-900 mb-1">{d.name}</h4>
                              <p className="text-emerald-600 font-semibold text-sm mb-2">{d.specialty}</p>
                              <p className="text-gray-500 text-xs">Experience: {d.experience}</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedDoctor(d);
                                setBookAppointment(true);
                              }}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md cursor-pointer"
                            >
                              Book Now
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="doctor-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DoctorCard
                doctor={selectedDoctor}
                goBack={() => setBookAppointment(false)}
                onBook={(appointment) =>
                  setBookedAppointments((prev) => [...prev, appointment])
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white py-8 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} HospiTex Healthcare. All rights reserved.</p>
          <p className="text-sm md:text-base mt-2 opacity-90">
            Contact us: info@hospitaltex.com | +91 12345 67890
          </p>
        </div>
      </motion.footer>
    </section>
  );
};

export default AppointmentServices;