import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Truck, ClipboardList, Activity, Star, CreditCard, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PatientHome = () => {
  const { api, user } = useApp();
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    reports: 0,
    ambulance: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [appointments, prescriptions, reports, ambulance] = await Promise.all([
        api.get('/appointments/patient'),
        api.get('/prescriptions/patient/all'),
        api.get('/diagnostics/patient/reports'),
        api.get('/ambulance/patient/requests')
      ]);
      setStats({
        appointments: appointments.data.data?.length || 0,
        prescriptions: prescriptions.data.data?.length || 0,
        reports: reports.data.data?.length || 0,
        ambulance: ambulance.data.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const quickActions = [
    { icon: Calendar, label: 'Book Appointment', color: 'bg-blue-500', path: '/patient/appointments' },
    { icon: ClipboardList, label: 'Book Diagnostic', color: 'bg-purple-500', path: '/patient/diagnostics' },
    { icon: Truck, label: 'Request Ambulance', color: 'bg-red-500', path: '/patient/ambulance' },
    { icon: FileText, label: 'My Consultations', color: 'bg-green-500', path: '/patient/consultations' },
  ];

  const statsCards = [
    { label: 'Appointments', value: stats.appointments, icon: Calendar, color: 'text-blue-600' },
    { label: 'Consultations', value: stats.appointments, icon: Video, color: 'text-green-600' },
    { label: 'Test Reports', value: stats.reports, icon: ClipboardList, color: 'text-purple-600' },
    { label: 'Ambulance', value: stats.ambulance, icon: Truck, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {user?.username}! 👋</h2>
        <p className="mt-2 opacity-90">Your health is our priority. How can we help you today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => window.location.href = action.path}
              className="card hover:shadow-xl transition-all group"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-700">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;
