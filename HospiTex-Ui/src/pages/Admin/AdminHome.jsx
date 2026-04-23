import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Stethoscope, Calendar, ClipboardList, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AdminHome = () => {
  const { api } = useApp();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalDiagnostics: 0,
    totalAppointments: 0,
    pendingVerifications: 0,
    recentAppointments: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Patients', value: stats.totalPatients, icon: Users, color: 'bg-green-500' },
    { label: 'Doctors', value: stats.totalDoctors, icon: Stethoscope, color: 'bg-purple-500' },
    { label: 'Diagnostics', value: stats.totalDiagnostics, icon: ClipboardList, color: 'bg-orange-500' },
    { label: 'Appointments', value: stats.totalAppointments, icon: Calendar, color: 'bg-red-500' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: AlertCircle, color: 'bg-yellow-500' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome to HospiTex Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Recent Users
          </h3>
          <div className="space-y-3">
            {stats.recentUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent users</p>
            ) : (
              stats.recentUsers.map((user) => (
                <div key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'Patient' ? 'bg-green-100 text-green-700' :
                    user.role === 'Doctor' ? 'bg-blue-100 text-blue-700' :
                    user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Recent Appointments
          </h3>
          <div className="space-y-3">
            {stats.recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent appointments</p>
            ) : (
              stats.recentAppointments.map((apt) => (
                <div key={apt._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Patient: {apt.patient?.username || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;