import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, FileText, Shield } from 'lucide-react';

function AdminUsersOverview() {
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-900 mb-4">User Management</h2>
          <p className="text-lg text-gray-700">
            Manage all users, their roles, and account status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <Users className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Users</h3>
            <p className="text-gray-600 text-sm mb-4">View and manage all registered users</p>
            <Link
              to="/admin-dashboard/users-services"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              Manage Users →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <UserCheck className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Patients</h3>
            <p className="text-gray-600 text-sm mb-4">Manage patient accounts and profiles</p>
            <Link
              to="/admin-dashboard/users-services?role=Patient"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View Patients →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <Shield className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Doctors</h3>
            <p className="text-gray-600 text-sm mb-4">Manage doctor accounts and specialties</p>
            <Link
              to="/admin-dashboard/users-services?role=Doctor"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View Doctors →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <FileText className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Diagnostics</h3>
            <p className="text-gray-600 text-sm mb-4">Review and verify diagnostic centers</p>
            <Link
              to="/admin-dashboard/users-services?role=Diagnostic"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View Diagnostics →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
          <h3 className="text-2xl font-bold text-purple-900 mb-6">Verification Process</h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Review Details</h4>
                <p className="text-gray-600 text-sm">Click "Review & Verify" to see all doctor/diagnostic credentials and information</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Check Information</h4>
                <p className="text-gray-600 text-sm">Review all credentials, contact information, and professional details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Approve or Reject</h4>
                <p className="text-gray-600 text-sm">After reviewing, approve verification or reject with a reason</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminUsersOverview;

