import React, { useState, useContext, useMemo } from "react";
import DoctorCard from "../../../components/DoctorCard";
import { AppContext } from "../../../Auth/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const AppointmentServices = () => {
  const { doctors, doctorsLoading, doctorsError } = useContext(AppContext);
  const [filter, setFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookAppointment, setBookAppointment] = useState(false);

  const categoryStats = useMemo(() => {
    return doctors.reduce((acc, doctor) => {
      const key = doctor.category || "general";
      acc[key] = acc[key] || { count: 0, specialties: new Set() };
      acc[key].count += 1;
      if (doctor.specialty) {
        acc[key].specialties.add(doctor.specialty);
      }
      return acc;
    }, {});
  }, [doctors]);

  const categoryCards = useMemo(() => {
    return Object.entries(categoryStats).map(([key, stats]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const specialtiesPreview = stats.specialties?.size
        ? Array.from(stats.specialties).slice(0, 2).join(", ")
        : "Consultations available";

      return {
        key,
        label,
        description: specialtiesPreview,
        count: stats.count,
      };
    });
  }, [categoryStats]);

  const categoryIconMap = {
    general: "👨‍⚕️",
    specialist: "🎯",
    followup: "📋",
    online: "💻",
  };

  const categories = useMemo(() => {
    const dynamicFilters = categoryCards.map((card) => ({
      key: card.key,
      label: card.label,
      icon: categoryIconMap[card.key] || "🩺",
    }));

    const baseFilter = [{ key: "all", label: "Show All", icon: "🌐" }];

    // Remove duplicates while preserving order
    const seen = new Set();
    return [...baseFilter, ...dynamicFilters].filter((filterOption) => {
      if (seen.has(filterOption.key)) return false;
      seen.add(filterOption.key);
      return true;
    });
  }, [categoryCards]);

  const filteredDoctors = useMemo(() => {
    if (filter === "all") return doctors;
    return doctors.filter((d) => d.category === filter);
  }, [doctors, filter]);

  const visibleCategoryCards = useMemo(() => {
    if (filter === "all") return categoryCards;
    return categoryCards.filter((card) => card.key === filter);
  }, [categoryCards, filter]);

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
              {categories.length > 0 && (
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
              )}

              {/* Loading / Error State */}
              {doctorsLoading && (
                <p className="text-center text-gray-600 mb-8">Loading live doctor availability...</p>
              )}
              {doctorsError && (
                <p className="text-center text-red-600 mb-8">{doctorsError}</p>
              )}

              {/* Services & Doctors */}
              <div className="max-w-7xl mx-auto px-8 mb-16">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  {/* Services Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                      <h2 className="text-3xl font-bold text-gray-900 text-center xl:text-left">
                        Care <span className="text-emerald-600">Categories</span>
                      </h2>
                      <p className="text-sm text-gray-500">
                        Showing {visibleCategoryCards.length} category{visibleCategoryCards.length !== 1 ? "ies" : ""}
                      </p>
                    </div>
                    {visibleCategoryCards.length === 0 ? (
                      <div className="bg-white/80 rounded-2xl p-6 border border-dashed border-emerald-200 text-center">
                        <p className="text-gray-600">No categories available yet. Please check back once doctors update their profiles.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {visibleCategoryCards.map((card, idx) => (
                          <motion.div
                            key={card.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 group cursor-pointer"
                          >
                            <p className="text-sm uppercase tracking-wide text-emerald-500 font-semibold">
                              {card.count} doctor{card.count !== 1 ? "s" : ""}
                            </p>
                            <h3 className="text-xl font-bold text-emerald-700 mb-2 group-hover:text-emerald-800 transition-colors">
                              {card.label}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{card.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
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
                    {filteredDoctors.length === 0 ? (
                      <div className="bg-white/80 rounded-2xl p-8 border border-dashed border-teal-200 text-center">
                        <p className="text-gray-600 mb-4">No doctors available for the selected category yet.</p>
                        {filter !== "all" && (
                          <button
                            onClick={() => setFilter("all")}
                            className="text-emerald-600 font-semibold underline"
                          >
                            View all categories
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4">
                        {filteredDoctors.map((d, index) => (
                          <motion.div
                            key={d.id || d.userId || index}
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
                                <p className="text-gray-500 text-xs">{d.experience}</p>
                                <p className="text-gray-400 text-xs">{d.location}</p>
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
                    )}
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
                onBooked={() => setBookAppointment(false)}
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