import React, { useState } from "react";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "John Doe", service: "General Checkup", time: "2025-09-03 10:00 AM", status: "Pending" },
    { id: 2, patient: "Anita Sharma", service: "Cardiologist Consultation", time: "2025-09-03 11:30 AM", status: "Confirmed" },
    { id: 3, patient: "Ravi Kumar", service: "Follow-up Visit", time: "2025-09-03 01:00 PM", status: "Pending" },
    { id: 4, patient: "Priya Nair", service: "Online Consultation", time: "2025-09-03 03:00 PM", status: "Completed" },
    { id: 5, patient: "Amit Singh", service: "Orthopedic Checkup", time: "2025-09-03 04:30 PM", status: "Pending" },
  ]);

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-gray-200 text-gray-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <section className="min-h-screen bg-green-50 px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-6 text-center">
          Manage Patient Appointments
        </h2>
        <p className="text-gray-700 mb-12 text-center">
          View, track, and manage all patient appointments efficiently.
        </p>

        {/* Appointment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">{app.patient}</h3>
                <p className="text-gray-600 mb-1">{app.service}</p>
                <p className="text-gray-500 text-sm mb-2">{app.time}</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {app.status !== "Completed" && app.status !== "Cancelled" && (
                  <>
                    <button
                      onClick={() => updateStatus(app.id, "Confirmed")}
                      className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 transition text-sm flex-1"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "Completed")}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm flex-1"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "Cancelled")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm flex-1"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorAppointments;
