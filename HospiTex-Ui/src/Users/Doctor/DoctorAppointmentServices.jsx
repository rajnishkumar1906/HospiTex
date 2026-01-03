import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../Auth/AppContext";
import apiClient from "../../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, Filter } from "lucide-react";
import { toast } from "react-toastify";
import DoctorNavbar from "./DoctorNavbar";

const DoctorAppointmentServices = () => {
  const { IsLoggedIn, UserRole } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    if (!IsLoggedIn || UserRole !== "Doctor") {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/api/appointments/doctor/all");
      const sortedApps = (data?.appointments || []).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
      setAppointments(sortedApps);
      setFilteredAppointments(sortedApps);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load appointments.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [IsLoggedIn, UserRole]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(app => app.status === statusFilter));
    }
  }, [statusFilter, appointments]);

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await apiClient.put(`/api/appointments/${id}/status`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
      toast.success(`Appointment ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to update appointment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return Clock;
      case "Confirmed":
        return CheckCircle;
      case "Completed":
        return CheckCircle;
      case "Cancelled":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(app => app.status === "Pending").length,
    confirmed: appointments.filter(app => app.status === "Confirmed").length,
    completed: appointments.filter(app => app.status === "Completed").length,
    cancelled: appointments.filter(app => app.status === "Cancelled").length,
    today: appointments.filter(app => {
      const today = new Date();
      const appDate = new Date(app.date);
      return today.toDateString() === appDate.toDateString();
    }).length
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      <DoctorNavbar />
      <section className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <Calendar className="w-10 h-10 text-emerald-600" />
              Manage Appointments
            </h2>
            <p className="text-gray-600 text-lg">
              View, track, and manage all patient appointments efficiently
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, color: "from-gray-500 to-slate-600" },
              { label: "Today", value: stats.today, color: "from-blue-500 to-cyan-600" },
              { label: "Pending", value: stats.pending, color: "from-yellow-500 to-orange-600" },
              { label: "Confirmed", value: stats.confirmed, color: "from-green-500 to-emerald-600" },
              { label: "Completed", value: stats.completed, color: "from-blue-500 to-indigo-600" },
              { label: "Cancelled", value: stats.cancelled, color: "from-red-500 to-pink-600" }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
              >
                <p className="text-xs text-gray-500 uppercase mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100 flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
            <button
              onClick={fetchAppointments}
              className="ml-auto px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 mx-auto mb-4 text-emerald-600 animate-spin" />
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
            >
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <p className="text-red-800 mb-4">{error}</p>
              <button
                onClick={fetchAppointments}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredAppointments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100"
            >
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 text-lg">
                {statusFilter === "All" 
                  ? "No appointments found" 
                  : `No ${statusFilter.toLowerCase()} appointments`}
              </p>
            </motion.div>
          )}

          {/* Appointment Cards */}
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.map((app, idx) => {
                const patientName = app.patient?.username || app.patient?.email || "Patient";
                const service = app.service || "Consultation";
                const appointmentDate = app.date ? new Date(app.date) : null;
                const StatusIcon = getStatusIcon(app.status);
                const isUpdating = updatingId === app._id;

                return (
                  <motion.div
                    key={app._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                            {patientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{patientName}</h3>
                            <p className="text-sm text-gray-500">{app.patient?.email}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(app.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {app.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm">{service}</span>
                        </div>
                        {appointmentDate && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm">
                              {appointmentDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                        {app.time && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm">{app.time}</span>
                          </div>
                        )}
                        {app.notes && (
                          <div className="bg-gray-50 rounded-lg p-3 mt-3">
                            <p className="text-xs text-gray-600 line-clamp-2">{app.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {app.status !== "Completed" && app.status !== "Cancelled" && (
                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                          {app.status === "Pending" && (
                            <button
                              onClick={() => updateStatus(app._id, "Confirmed")}
                              disabled={isUpdating}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                              {isUpdating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(app._id, "Completed")}
                            disabled={isUpdating}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            {isUpdating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                            Complete
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, "Cancelled")}
                            disabled={isUpdating}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            {isUpdating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default DoctorAppointmentServices;
