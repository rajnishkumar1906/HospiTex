import React from 'react';
import { Link } from 'react-router-dom';

const DoctorAppointmentServices = () => {
  const services = [
    {
      title: 'Today’s Schedule',
      desc: 'View all appointments for the day in one place with time slots and patient info.',
    },
    {
      title: 'Upcoming Consultations',
      desc: 'Plan ahead with a detailed list of upcoming appointments.',
    },
    {
      title: 'Follow-Up Visits',
      desc: 'Track patients requiring follow-up care and schedule accordingly.',
    },
    {
      title: 'Patient Notes',
      desc: 'Access and update patient medical history and visit notes instantly.',
    },
    {
      title: 'Rescheduling',
      desc: 'Easily adjust appointment times to fit your availability.',
    },
    {
      title: 'Missed Appointments',
      desc: 'Log and manage patients who missed their appointments.',
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-100 to-white px-8 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-green-800 mb-4">
          Appointment Management Tools
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Streamline your workflow with powerful tools to manage patient consultations efficiently and without hassle.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border border-green-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-green-700 mb-3">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/doctor-dashboard/appointments"
            className="inline-block bg-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-800 transition duration-300 transform hover:scale-105"
          >
            Go to Appointments
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorAppointmentServices;
