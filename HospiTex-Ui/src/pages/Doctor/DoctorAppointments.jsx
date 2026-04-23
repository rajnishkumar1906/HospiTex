import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Video, Phone, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorAppointments = () => {
  const { api } = useApp();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/doctor/all');
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    setProcessingId(appointmentId);
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, { status });
      if (response.data.success) {
        toast.success(`Appointment ${status}`);
        fetchAppointments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setProcessingId(null);
    }
  };

  const startConsultation = async (appointmentId) => {
    setProcessingId(appointmentId);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Starting consultation - Token exists:', !!token);
      console.log('Appointment ID:', appointmentId);
      
      const response = await api.post('/consultations/start', {
        appointmentId: appointmentId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Start consultation response:', response.data);
      
      if (response.data.success) {
        const { roomId } = response.data.data.consultation;
        toast.success('Consultation started!');
        navigate(`/doctor/consultations/${roomId}`);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to start consultation');
    } finally {
      setProcessingId(null);
    }
  };

  const viewPrescription = (appointmentId) => {
    navigate(`/doctor/prescriptions?appointment=${appointmentId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(apt => apt.status === 'Pending');
  const confirmedAppointments = appointments.filter(apt => apt.status === 'Confirmed');
  const completedAppointments = appointments.filter(apt => apt.status === 'Completed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your patient appointments</p>
      </div>

      {pendingAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Pending Requests ({pendingAppointments.length})
          </h3>
          <div className="space-y-4">
            {pendingAppointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{apt.patient?.username || 'Patient'}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(apt.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(apt._id, 'Confirmed')}
                      disabled={processingId === apt._id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 disabled:opacity-50"
                    >
                      {processingId === apt._id ? 'Processing...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => updateStatus(apt._id, 'Cancelled')}
                      disabled={processingId === apt._id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {confirmedAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Confirmed Appointments ({confirmedAppointments.length})
          </h3>
          <div className="space-y-4">
            {confirmedAppointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{apt.patient?.username || 'Patient'}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(apt.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startConsultation(apt._id)}
                      disabled={processingId === apt._id}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      {processingId === apt._id ? 'Starting...' : 'Start Consultation'}
                    </button>
                    <button
                      onClick={() => updateStatus(apt._id, 'Completed')}
                      disabled={processingId === apt._id}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            Completed Appointments ({completedAppointments.length})
          </h3>
          <div className="space-y-4">
            {completedAppointments.map((apt) => (
              <div key={apt._id} className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{apt.patient?.username || 'Patient'}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(apt.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => viewPrescription(apt._id)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Prescription
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;