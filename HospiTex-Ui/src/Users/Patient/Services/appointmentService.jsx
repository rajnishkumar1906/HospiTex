import React, { useState, useContext } from "react";
import DoctorCard from "../../../components/DoctorCard";
import { AppContext } from "../../../auth/AppContext";
import "react-toastify/dist/ReactToastify.css";

const AppointmentServices = () => {
  const { services, doctors, bookedAppointments, setBookedAppointments } = useContext(AppContext);
  const [filter, setFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookAppointment, setBookAppointment] = useState(false);

  const filteredDoctors = filter === "all" ? doctors : doctors.filter(d => d.category === filter);
  const filteredServices = filter === "all" ? services : services.filter(s => s.category === filter);

  return (
    <section className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-white">
      <div className="flex-1">
        {!bookAppointment ? (
          <>
            {/* Header */}
            <div className="px-8 py-8 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4 drop-shadow-md">
                Our Appointment Services
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-lg md:text-xl">
                Choose a service, view available doctors, and book your consultation.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap px-8">
              {["all", "general", "specialist", "followup", "online"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full font-medium shadow-md transition ${
                    filter === cat
                      ? "bg-green-700 text-white"
                      : "bg-white border border-green-300 text-green-700 hover:bg-green-50"
                  }`}
                >
                  {cat === "all" ? "Show All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Services & Doctors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto px-8 mb-16">
              {/* Services */}
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-6 text-center md:text-left">
                  Services Available
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredServices.map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                      <h3 className="text-xl font-semibold text-green-700 mb-2">{s.title}</h3>
                      <p className="text-gray-600 text-sm">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctors */}
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-6 text-center md:text-left">
                  Available Doctors
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {filteredDoctors.map(d => (
                    <div
                      key={d.doctor_id}
                      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition flex flex-col md:flex-row gap-4"
                    >
                      <img
                        src={d.img}
                        alt={d.name}
                        className="w-24 h-24 rounded-full object-cover border border-green-200"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-green-700">{d.name}</h4>
                        <p className="text-gray-600 text-sm">{d.specialty}</p>
                        <p className="text-gray-500 text-xs mb-1">Experience: {d.experience}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDoctor(d);
                          setBookAppointment(true);
                        }}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition cursor-pointer mt-2 md:mt-0"
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <DoctorCard
            doctor={selectedDoctor}
            goBack={() => setBookAppointment(false)}
            onBook={(appointment) =>
              setBookedAppointments((prev) => [...prev, appointment])
            }
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} HospiTex Healthcare. All rights reserved.</p>
          <p className="text-sm md:text-base mt-1">
            Contact us: info@hospitaltex.com | +91 12345 67890
          </p>
        </div>
      </footer>
    </section>
  );
};

export default AppointmentServices;
