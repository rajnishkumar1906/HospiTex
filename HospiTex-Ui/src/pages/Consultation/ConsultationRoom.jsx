import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Send, FileText, CreditCard, CheckCircle, Clock, User, Stethoscope, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ConsultationRoom = () => {
  const { consultationId } = useParams();
  const { api, user } = useApp();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    diagnosis: '',
    notes: ''
  });
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  useEffect(() => {
    fetchConsultation();
    startPolling();
    
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startPolling = () => {
    pollInterval.current = setInterval(() => {
      fetchMessages();
    }, 5000);
  };

  const fetchConsultation = async () => {
    try {
      const response = await api.get(`/consultation/${consultationId}`);
      if (response.data.success) {
        setConsultation(response.data.data);
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error fetching consultation:', error);
      toast.error('Failed to load consultation');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/consultation/${consultationId}/messages`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      const response = await api.post(`/consultation/${consultationId}/message`, {
        message: newMessage
      });
      if (response.data.success) {
        setNewMessage('');
        await fetchMessages();
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const addPrescription = async () => {
    if (!prescriptionData.medications[0].name) {
      toast.error('Please add at least one medication');
      return;
    }
    
    try {
      const response = await api.post(`/consultation/${consultationId}/prescription`, prescriptionData);
      if (response.data.success) {
        toast.success('Prescription added successfully');
        setShowPrescription(false);
        fetchConsultation();
        setPrescriptionData({
          medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
          diagnosis: '',
          notes: ''
        });
      }
    } catch (error) {
      toast.error('Failed to add prescription');
    }
  };

  const processPayment = async () => {
    try {
      const response = await api.post(`/consultation/${consultationId}/payment`, {
        amount: consultation?.appointment?.appointmentFee || 500
      });
      if (response.data.success) {
        toast.success('Payment successful!');
        setShowPayment(false);
        fetchConsultation();
      }
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  const completeConsultation = async () => {
    if (window.confirm('Are you sure you want to complete this consultation?')) {
      try {
        const response = await api.post(`/consultation/${consultationId}/complete`);
        if (response.data.success) {
          toast.success('Consultation completed');
          fetchConsultation();
          setTimeout(() => navigate('/doctor'), 2000);
        }
      } catch (error) {
        toast.error('Failed to complete consultation');
      }
    }
  };

  const addMedication = () => {
    setPrescriptionData({
      ...prescriptionData,
      medications: [...prescriptionData.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const updateMedication = (index, field, value) => {
    const newMedications = [...prescriptionData.medications];
    newMedications[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medications: newMedications });
  };

  const removeMedication = (index) => {
    const newMedications = prescriptionData.medications.filter((_, i) => i !== index);
    setPrescriptionData({ ...prescriptionData, medications: newMedications });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const isDoctor = user?.role === 'Doctor';
  const isPatient = user?.role === 'Patient';
  const isPaid = consultation?.payment?.status === 'Success';
  const hasPrescription = !!consultation?.prescription;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-md p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Consultation Room</h1>
              <p className="text-gray-500 text-sm">
                {isDoctor ? `Patient: ${consultation?.patient?.username}` : `Doctor: Dr. ${consultation?.doctor?.username}`}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                consultation?.status === 'Active' ? 'bg-green-100 text-green-700' :
                consultation?.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {consultation?.status}
              </span>
              {isPaid && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <CheckCircle className="w-4 h-4 inline mr-1" /> Paid
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Chat Section */}
          <div className="md:col-span-2 bg-white rounded-b-2xl shadow-md flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender?._id === user?._id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-xs opacity-75 mb-1">
                        {msg.sender?.role === 'Doctor' ? 'Dr. ' : ''}{msg.sender?.username}
                      </p>
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 input-field"
                disabled={consultation?.status === 'Completed'}
              />
              <button
                type="submit"
                disabled={sending || consultation?.status === 'Completed'}
                className="btn-primary px-4"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-4">
            {/* Payment Section */}
            {isPatient && !isPaid && consultation?.status === 'Active' && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  Payment
                </h3>
                <p className="text-2xl font-bold text-primary-600 mb-3">
                  ₹{consultation?.appointment?.appointmentFee || 500}
                </p>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full btn-primary"
                >
                  Pay Now
                </button>
              </div>
            )}

            {/* Prescription Section - Doctor */}
            {isDoctor && !hasPrescription && consultation?.status === 'Active' && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  Prescription
                </h3>
                <button
                  onClick={() => setShowPrescription(true)}
                  className="w-full btn-primary"
                >
                  Add Prescription
                </button>
              </div>
            )}

            {/* Prescription View */}
            {hasPrescription && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Prescription
                </h3>
                <button
                  onClick={() => navigate(`/prescriptions/${consultation?.prescription?._id}`)}
                  className="w-full btn-secondary"
                >
                  View Prescription
                </button>
              </div>
            )}

            {/* Complete Consultation - Doctor */}
            {isDoctor && consultation?.status === 'Active' && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  End Consultation
                </h3>
                <button
                  onClick={completeConsultation}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  Complete Consultation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Dummy Payment</h3>
            <p className="text-gray-600 mb-4">Amount: ₹{consultation?.appointment?.appointmentFee || 500}</p>
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-500">Test Payment Details:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p>💳 Card: 4242 4242 4242 4242</p>
                <p>📅 Expiry: 12/25</p>
                <p>🔐 CVV: 123</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={processPayment} className="flex-1 btn-primary">Pay Now</button>
              <button onClick={() => setShowPayment(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add Prescription</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Diagnosis</label>
                <textarea
                  value={prescriptionData.diagnosis}
                  onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                  className="input-field"
                  rows="2"
                  placeholder="Enter diagnosis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Medications</label>
                {prescriptionData.medications.map((med, idx) => (
                  <div key={idx} className="border p-3 rounded-lg mb-2">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Medicine Name"
                        value={med.name}
                        onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                        className="input-field text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                        className="input-field text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                        className="input-field text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) => updateMedication(idx, 'duration', e.target.value)}
                        className="input-field text-sm"
                      />
                    </div>
                    {prescriptionData.medications.length > 1 && (
                      <button onClick={() => removeMedication(idx)} className="text-red-500 text-sm">Remove</button>
                    )}
                  </div>
                ))}
                <button onClick={addMedication} className="text-primary-500 text-sm">+ Add Medicine</button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={prescriptionData.notes}
                  onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                  className="input-field"
                  rows="2"
                  placeholder="Additional instructions"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={addPrescription} className="flex-1 btn-primary">Save Prescription</button>
                <button onClick={() => setShowPrescription(false)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationRoom;