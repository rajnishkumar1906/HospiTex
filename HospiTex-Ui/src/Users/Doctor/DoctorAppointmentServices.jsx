import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../Auth/AppContext";
import apiClient from "../../config/axios";
import { motion } from "framer-motion";

const DoctorAppointments = () => {
  const { IsLoggedIn, UserRole } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    if (!IsLoggedIn || UserRole !== "Doctor") {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/api/appointments/doctor/all");
      setAppointments(data?.appointments || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load appointments.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [IsLoggedIn, UserRole]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/api/appointments/${id}/status`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to update appointment status.");
    }
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
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <section className="min-h-screen bg-green-50 px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-6 text-center">
            Manage Patient Appointments
          </h2>
          <p className="text-gray-700 mb-12 text-center">
            View, track, and manage all patient appointments efficiently.
          </p>
          <div className="flex justify-center gap-6 mb-10 flex-wrap">
            <div className="bg-white rounded-2xl px-6 py-4 shadow border text-center">
              <p className="text-sm text-gray-500 uppercase">Total</p>
              <p className="text-2xl font-semibold text-green-700">{appointments.length}</p>
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow border text-center">
              <p className="text-sm text-gray-500 uppercase">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {appointments.filter(app => app.status === "Pending").length}
              </p>
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow border text-center">
              <p className="text-sm text-gray-500 uppercase">Confirmed</p>
              <p className="text-2xl font-semibold text-green-600">
                {appointments.filter(app => app.status === "Confirmed").length}
              </p>
            </div>
          </div>
        </motion.div>

        {loading && (
          <p className="text-center text-gray-600">Fetching latest appointments...</p>
        )}

        {error && (
          <div className="text-center text-red-600">
            <p className="mb-2">{error}</p>
            <button
              onClick={fetchAppointments}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <p className="text-center text-gray-600">No appointments assigned yet.</p>
        )}

        {/* Appointment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {appointments.map((app, idx) => {
            const patientName = app.patient?.username || app.patient?.email || "Patient";
            const service = app.service || "Consultation";
            const appointmentDate = app.date ? new Date(app.date) : null;

            return (
            <div
              key={app._id || idx}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">{patientName}</h3>
                <p className="text-gray-600 mb-1">{service}</p>
                <p className="text-gray-500 text-sm mb-2">
                  {appointmentDate
                    ? appointmentDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : "Date not set"}{" "}
                  · {app.time || "Time TBD"}
                </p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {app.status !== "Completed" && app.status !== "Cancelled" && (
                  <>
                    <button
                      onClick={() => updateStatus(app._id, "Confirmed")}
                      className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 transition text-sm flex-1"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(app._id, "Completed")}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm flex-1"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateStatus(app._id, "Cancelled")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm flex-1"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
};

export default DoctorAppointments;
