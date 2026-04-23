import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, FileText, Calendar, Users } from 'lucide-react';

const DoctorHome = () => {
  const { user, api } = useApp();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingPrescriptions: 0
  });

  useEffect(() => {
    fetchVerificationStatus();
    fetchStats();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const response = await api.get('/doctor/verification-status');
      if (response.data.success) {
        setVerificationStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/appointments/doctor/all');
      if (response.data.success) {
        const today = new Date().toISOString().split('T')[0];
        const todayApps = response.data.data.filter(apt => 
          new Date(apt.date).toISOString().split('T')[0] === today
        );
        setStats({
          todayAppointments: todayApps.length,
          totalPatients: response.data.data.length,
          pendingPrescriptions: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Check if user is verified
  const isVerified = user?.isVerified || verificationStatus?.isVerified;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome, Dr. {user?.username}! 👋</h2>
        <p className="mt-2 opacity-90">Manage your appointments, patients, and prescriptions.</p>
      </div>

      {/* Verified Badge - Show when verified */}
      {isVerified && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Account Verified</h3>
              <p className="text-sm text-green-700">Your account has been verified. You can now fully use all features.</p>
            </div>
          </div>
        </div>
      )}

      {/* Verification Status Card - Only show if not verified */}
      {!isVerified && (
        <div className="card border-l-4 border-orange-500">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Shield className="w-8 h-8 text-orange-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Account Not Verified</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {verificationStatus?.verificationRequested 
                    ? 'Your verification request is pending admin review. You will be notified once verified.'
                    : 'Please complete your profile and submit verification request to get verified.'}
                </p>
                {!verificationStatus?.verificationRequested && (
                  <Link
                    to="/doctor/profile"
                    className="inline-block mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    Complete Profile & Request Verification
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-800">{stats.todayAppointments}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Patients</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalPatients}</p>
            </div>
            <Users className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Prescriptions</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingPrescriptions}</p>
            </div>
            <FileText className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link to="/doctor/appointments" className="p-3 bg-gray-50 rounded-lg text-center hover:bg-primary-50 transition-colors">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-primary-500" />
            <span className="text-sm">View Appointments</span>
          </Link>
          <Link to="/doctor/patients" className="p-3 bg-gray-50 rounded-lg text-center hover:bg-primary-50 transition-colors">
            <Users className="w-5 h-5 mx-auto mb-1 text-primary-500" />
            <span className="text-sm">My Patients</span>
          </Link>
          <Link to="/doctor/prescriptions" className="p-3 bg-gray-50 rounded-lg text-center hover:bg-primary-50 transition-colors">
            <FileText className="w-5 h-5 mx-auto mb-1 text-primary-500" />
            <span className="text-sm">Prescriptions</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;