import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Video, Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, Phone, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientConsultations = () => {
  const { api } = useApp();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchConsultations();
  }, [activeTab]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultations/my');
      if (response.data.success) {
        let data = response.data.data;
        if (activeTab === 'active') {
          data = data.filter(c => c.status !== 'ended');
        } else {
          data = data.filter(c => c.status === 'ended');
        }
        setConsultations(data);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const joinConsultation = (roomId) => {
    navigate(`/patient/consultations/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Consultations</h1>
        <p className="text-gray-600">Join and manage your video consultations with doctors</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'active'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Consultations
        </button>
        <button
          onClick={() => setActiveTab('ended')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'ended'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
        </button>
      </div>

      {consultations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No consultations found</p>
          <p className="text-sm text-gray-400 mt-1">
            {activeTab === 'active' 
              ? 'Active consultations will appear here when a doctor starts the consultation' 
              : 'Completed consultations will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {consultations.map((consultation) => (
            <div key={consultation._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Dr. {consultation.doctor?.name || 'Doctor'}
                    </h3>
                    <p className="text-sm text-gray-500">{consultation.doctor?.specialty || 'General Physician'}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(consultation.scheduledTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(consultation.scheduledTime).toLocaleTimeString()}
                      </span>
                    </div>
                    {consultation.status === 'ended' && consultation.endedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Ended: {new Date(consultation.endedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    consultation.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : consultation.status === 'scheduled'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {consultation.status === 'active' ? 'Live Now' : 
                     consultation.status === 'scheduled' ? 'Scheduled' : 'Ended'}
                  </span>

                  {consultation.status !== 'ended' && consultation.meetingLink && (
                    <button
                      onClick={() => joinConsultation(consultation.roomId)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <Video className="w-4 h-4" />
                      Join Now
                    </button>
                  )}

                  {consultation.status === 'scheduled' && !consultation.meetingLink && (
                    <button
                      disabled
                      className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      <Clock className="w-4 h-4" />
                      Waiting for Doctor
                    </button>
                  )}

                  {consultation.status === 'ended' && (
                    <button
                      onClick={() => navigate(`/patient/prescriptions`)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                    >
                      <FileText className="w-4 h-4" />
                      View Prescription
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientConsultations;