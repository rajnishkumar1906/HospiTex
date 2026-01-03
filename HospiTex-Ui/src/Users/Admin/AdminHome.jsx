import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, FileText, UserCheck } from 'lucide-react';
import apiClient from '../../config/axios';
import { toast } from 'react-toastify';

function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiClient.get('/api/admin/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="pt-16 min-h-screen w-full bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 px-6 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-16 min-h-screen w-full bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Manage your hospital system efficiently. Multiple admins can work together to handle all operations.
          </p>
        </div>

        {/* Key Statistics - Simplified */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-md border border-purple-100 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{stats?.totalPatients || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Patients</div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border border-purple-100 text-center">
            <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{stats?.totalDoctors || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Doctors</div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border border-purple-100 text-center">
            <FileText className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-900">{stats?.totalDiagnostics || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Diagnostics</div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border border-purple-100 text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{stats?.totalAppointments || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Appointments</div>
          </div>
        </div>

        {/* Pending Verifications Alert */}
        {stats?.totalUnverified > 0 && (
          <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">!</span>
              </div>
              <div>
                <h4 className="font-bold text-yellow-900">Pending Verifications</h4>
                <p className="text-sm text-yellow-800">
                  {stats.totalUnverified} {stats.totalUnverified === 1 ? 'account' : 'accounts'} need verification
                  ({stats.unverifiedDoctors || 0} doctors, {stats.unverifiedDiagnostics || 0} diagnostics)
                </p>
              </div>
            </div>
            <Link
              to="/admin-dashboard/users-services"
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold transition-colors"
            >
              Verify Now
            </Link>
          </div>
        )}

        {/* Quick Actions - Simplified */}
        <div className="max-w-2xl mx-auto">
          <Link
            to="/admin-dashboard/users"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400 group block"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">User Verification</h3>
                <p className="text-gray-600 mt-1">Review and verify doctors and diagnostics</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-semibold text-purple-900 mb-2">📋 Important Notes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Patients are automatically verified upon registration</li>
            <li>• Only Doctors and Diagnostics require admin verification</li>
            <li>• Multiple admins can work simultaneously to manage the system</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AdminHome;

