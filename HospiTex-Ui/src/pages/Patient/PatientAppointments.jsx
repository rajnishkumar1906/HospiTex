import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, Video, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientAppointments = () => {
  const { api } = useApp();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState({});

  useEffect(() => {
    fetchAppointments();
    fetchConsultations();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/patient');
      if (response.data.success) {
        setAppointments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async () => {
    try {
      const response = await api.get('/consultations/my');
      if (response.data.success) {
        const consMap = {};
        (response.data.data || []).forEach(cons => {
          if (cons && cons.appointment && cons.appointment._id) {
            consMap[cons.appointment._id] = cons;
          }
        });
        setConsultations(consMap);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!appointmentId) return;
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await api.delete(`/appointments/${appointmentId}/cancel`);
        if (response.data.success) {
          toast.success('Appointment cancelled');
          fetchAppointments();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel');
      }
    }
  };

  const joinConsultation = (roomId) => {
    if (roomId) {
      navigate(`/patient/consultations/${roomId}`);
    }
  };

  const viewPrescription = (appointmentId) => {
    if (appointmentId) {
      navigate(`/patient/prescriptions?appointment=${appointmentId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const pendingAppointments = (appointments || []).filter(apt => apt && apt.status === 'Pending');
  const confirmedAppointments = (appointments || []).filter(apt => apt && apt.status === 'Confirmed');
  const completedAppointments = (appointments || []).filter(apt => apt && apt.status === 'Completed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
          <p className="text-gray-500 text-sm mt-1">View and manage your appointments</p>
        </div>
        <button
          onClick={() => navigate('/patient/book-appointment')}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
        >
          + Book Appointment
        </button>
      </div>

      {/* Pending Appointments - Waiting for confirmation */}
      {pendingAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Pending ({pendingAppointments.length})</h3>
          <div className="space-y-4">
            {pendingAppointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{apt.doctorName || apt.doctor?.username || 'Doctor'}</h3>
                      <p className="text-sm text-gray-500">{apt.doctorSpecialty || 'General Physician'}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(apt.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                      Waiting for confirmation
                    </span>
                    <button
                      onClick={() => cancelAppointment(apt._id)}
                      className="px-3 py-1 text-red-500 border border-red-500 rounded-lg text-sm hover:bg-red-50"
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

      {/* Confirmed Appointments - ONLY Join Consultation button */}
      {confirmedAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Confirmed ({confirmedAppointments.length})</h3>
          <div className="space-y-4">
            {confirmedAppointments.map((apt) => {
              const consultation = consultations[apt._id];
              const canJoin = consultation && consultation.roomId;
              
              return (
                <div key={apt._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{apt.doctorName || apt.doctor?.username || 'Doctor'}</h3>
                        <p className="text-sm text-gray-500">{apt.doctorSpecialty || 'General Physician'}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(apt.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canJoin ? (
                        <button
                          onClick={() => joinConsultation(consultation.roomId)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Join Consultation
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-sm flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Waiting for doctor to start...
                        </span>
                      )}
                      <button
                        onClick={() => cancelAppointment(apt._id)}
                        className="px-3 py-1 text-red-500 border border-red-500 rounded-lg text-sm hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Appointments - ONLY View Prescription */}
      {completedAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Completed ({completedAppointments.length})</h3>
          <div className="space-y-4">
            {completedAppointments.map((apt) => (
              <div key={apt._id} className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{apt.doctorName || apt.doctor?.username || 'Doctor'}</h3>
                      <p className="text-sm text-gray-500">{apt.doctorSpecialty || 'General Physician'}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(apt.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => viewPrescription(apt._id)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 flex items-center gap-2"
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
          <button
            onClick={() => navigate('/patient/book-appointment')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Book Your First Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;