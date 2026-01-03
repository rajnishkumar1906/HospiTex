import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../../config/axios';
import { toast } from 'react-toastify';
import { Calendar, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import AdminNavbar from './AdminNavbar';

const AdminAppointmentsServices = () => {
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, page]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page);
      params.append('limit', 10);

      const response = await apiClient.get(`/api/admin/appointments?${params}`);
      if (response.data.success) {
        setAppointments(response.data.appointments);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Removed admin appointment management functions - appointments are managed by doctors and patients

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Confirmed':
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <AdminNavbar />
      <section className="pt-24 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-purple-900 mb-2">Appointment Overview</h2>
            <p className="text-lg text-gray-700 mb-2">View all appointments in the system</p>
            <p className="text-sm text-gray-500">Note: This is a read-only view. Appointments are managed by doctors and patients directly.</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <Link
                to="/admin-dashboard/appointments"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                Back to Overview
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Patient</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Doctor</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Date & Time</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Service</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                            No appointments found
                          </td>
                        </tr>
                      ) : (
                        appointments.map((appointment) => (
                          <tr key={appointment._id} className="hover:bg-purple-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">
                                {appointment.patient?.username || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.patient?.email || ''}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">
                                {appointment.doctor?.username || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.doctor?.email || ''}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-900">{formatDate(appointment.date)}</div>
                              <div className="text-sm text-gray-500">{appointment.time}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">{appointment.service}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-500">View Only</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-purple-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white border border-purple-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminAppointmentsServices;