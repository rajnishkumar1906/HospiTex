import React, { useState } from 'react';
import { motion } from 'framer-motion';

const initialAppointments = [
  { id: 1, patientName: 'John Doe', date: '2025-08-15', time: '10:00 AM', reason: 'General Checkup' },
  { id: 2, patientName: 'Jane Smith', date: '2025-08-16', time: '11:30 AM', reason: 'Follow-up' },
  { id: 3, patientName: 'Alex Johnson', date: '2025-08-17', time: '02:00 PM', reason: 'Consultation' },
];

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleView = (id) => alert(`Viewing details for appointment ID: ${id}`);
  const handleUpdate = (id) => alert(`Update coming soon for appointment ID: ${id}`);
  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.filter((a) => a.id !== id));
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 px-8 py-16">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-800 mb-10 text-center max-w-4xl mx-auto border-b-4 border-green-600 pb-3"
      >
        Doctor Appointment Management
      </motion.h2>

      {appointments.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 text-lg max-w-xl mx-auto"
        >
          No appointments scheduled.
        </motion.p>
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="max-w-5xl mx-auto grid gap-8"
        >
          {appointments.map(({ id, patientName, date, time, reason }) => (
            <motion.li
              key={id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-white border border-green-200 rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-2xl font-semibold text-green-900 mb-2">{patientName}</h3>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Date:</span> {date}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Time:</span> {time}</p>
              <p className="text-gray-700 mb-4"><span className="font-semibold">Reason:</span> {reason}</p>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleView(id)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleUpdate(id)}
                  className="bg-yellow-400 text-yellow-900 px-5 py-2 rounded-xl shadow hover:bg-yellow-500 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleCancel(id)}
                  className="bg-red-600 text-white px-5 py-2 rounded-xl shadow hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
};

export default AppointmentManagement;
