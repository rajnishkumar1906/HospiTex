import React from 'react';
import { Link } from 'react-router-dom';

const AppointmentServices = () => {
  const services = [
    {
      title: 'General Checkups',
      desc: 'Routine examinations to monitor your health and catch early signs of illness.',
    },
    {
      title: 'Specialist Booking',
      desc: 'Consult top specialists including Cardiologists, Neurologists, and Orthopedics.',
    },
    {
      title: 'Online Consultations',
      desc: 'Video/audio calls with doctors from the comfort of your home.',
    },
    {
      title: 'Follow-up Appointments',
      desc: 'Schedule recurring visits and manage post-treatment consultations easily.',
    },
    {
      title: 'Second Opinions',
      desc: 'Need clarity? Get verified second opinions from our expert panel.',
    },
    {
      title: 'Emergency Slots',
      desc: 'Book urgent consultations for priority medical attention.',
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-100 to-white px-8 py-16">
      <h2 className="text-4xl font-extrabold text-green-800 mb-4 text-center">
        Our Appointment Services
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        HospiTex offers fast, secure, and patient-friendly appointment options with top-rated doctors.
        Whether it’s your first visit or a follow-up, we make booking hassle-free.
      </p>

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

      <div className="text-center mt-16">
        <Link
          to="/patientReg"
          className="bg-green-700 text-white px-8 py-3 rounded-full shadow hover:bg-green-800 transition duration-300"
        >
          Book Appointment Now
        </Link>
      </div>
    </section>
  );
};

export default AppointmentServices;
