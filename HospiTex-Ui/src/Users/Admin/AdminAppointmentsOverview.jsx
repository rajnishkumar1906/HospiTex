import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

function AdminAppointmentsOverview() {
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-900 mb-4">Appointment Overview</h2>
          <p className="text-lg text-gray-700 mb-2">
            View appointment statistics and reports
          </p>
          <p className="text-sm text-gray-500">
            Note: Appointments are managed by doctors and patients. Admins can only view statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <Calendar className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Appointments</h3>
            <p className="text-gray-600 text-sm mb-4">View all appointments in the system</p>
            <Link
              to="/admin-dashboard/appointments-services"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <Clock className="w-8 h-8 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Pending</h3>
            <p className="text-gray-600 text-sm mb-4">Appointments awaiting confirmation</p>
            <Link
              to="/admin-dashboard/appointments-services?status=Pending"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View Pending →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Completed</h3>
            <p className="text-gray-600 text-sm mb-4">Successfully completed appointments</p>
            <Link
              to="/admin-dashboard/appointments-services?status=Completed"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View Completed →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <XCircle className="w-8 h-8 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cancelled</h3>
            <p className="text-gray-600 text-sm mb-4">Cancelled appointments</p>
            <Link
              to="/admin-dashboard/appointments-services?status=Cancelled"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View Cancelled →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
          <h3 className="text-2xl font-bold text-purple-900 mb-6">Appointment Management Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">View All Appointments</h4>
                <p className="text-gray-600 text-sm">Browse through all appointments with filtering options</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Update Status</h4>
                <p className="text-gray-600 text-sm">Change appointment status (Pending, Confirmed, Completed, Cancelled)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">View Details</h4>
                <p className="text-gray-600 text-sm">See complete appointment information including patient and doctor details</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Delete Appointments</h4>
                <p className="text-gray-600 text-sm">Remove appointments from the system when necessary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminAppointmentsOverview;

