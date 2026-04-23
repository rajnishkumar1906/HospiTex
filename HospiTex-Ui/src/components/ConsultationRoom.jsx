import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Send, Paperclip, Video, Mic, MicOff, VideoOff, 
  PhoneOff, Download, X, FileText, CheckCheck, User, ArrowLeft,
  Plus, Clipboard, Trash2, Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const ConsultationRoom = () => {
  const { roomId } = useParams();
  const { user, api } = useApp();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendingFile, setSendingFile] = useState(false);
  const [consultationEnded, setConsultationEnded] = useState(false);
  
  // Prescription State
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    notes: '',
    followUpDate: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });
  const [submittingPrescription, setSubmittingPrescription] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load consultation
  useEffect(() => {
    loadConsultation();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [roomId]);

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/consultations/join/${roomId}`);
      
      if (response.data.success) {
        const data = response.data.data;
        setConsultation(data);
        setMessages(data.messages || []);
        
        if (data.consultation.status === 'ended') {
          setConsultationEnded(true);
          toast('Consultation has ended', { icon: '📋' });
        }
      } else {
        toast.error('Failed to load consultation');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error loading consultation:', error);
      toast.error(error.response?.data?.message || 'Failed to load consultation');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!consultation?.consultation?.id) return;
    
    try {
      const response = await api.get(`/consultations/${consultation.consultation.id}/messages`);
      if (response.data.success) {
        setMessages(response.data.data || []);
        
        // Mark messages as read
        await api.put(`/consultations/${consultation.consultation.id}/mark-read`);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      if (selectedFile) {
        setSendingFile(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await api.post(
          `/consultations/${consultation.consultation.id}/share-file`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        if (response.data.success) {
          toast.success('File shared successfully');
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          // Refresh messages
          await loadMessages();
        }
        setSendingFile(false);
      }

      if (newMessage.trim()) {
        const response = await api.post(`/consultations/${consultation.consultation.id}/message`, {
          message: newMessage
        });
        
        if (response.data.success) {
          setMessages(prev => [...prev, response.data.data]);
          setNewMessage('');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
      setSendingFile(false);
    }
  };

  const endConsultation = async () => {
    if (window.confirm('Are you sure you want to end this consultation?')) {
      try {
        const response = await api.put(`/consultations/${consultation.consultation.id}/end`, {
          notes: 'Consultation ended by doctor'
        });
        
        if (response.data.success) {
          toast.success('Consultation ended successfully');
          setConsultationEnded(true);
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      } catch (error) {
        console.error('Error ending consultation:', error);
        toast.error(error.response?.data?.message || 'Failed to end consultation');
      }
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const downloadFile = (fileUrl, fileName) => {
    window.open(fileUrl, '_blank');
  };

  const goBack = () => {
    navigate(-1);
  };

  const addMedication = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const removeMedication = (index) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...prescriptionForm.medications];
    newMedications[index][field] = value;
    setPrescriptionForm(prev => ({ ...prev, medications: newMedications }));
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionForm.diagnosis || prescriptionForm.medications.length === 0) {
      toast.error('Please fill diagnosis and at least one medication');
      return;
    }

    try {
      setSubmittingPrescription(true);
      const response = await api.post(`/consultations/${consultation.consultation.id}/prescription`, prescriptionForm);
      
      if (response.data.success) {
        toast.success('Prescription added successfully');
        setShowPrescriptionModal(false);
        setPrescriptionForm({
          diagnosis: '',
          notes: '',
          followUpDate: '',
          medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
        });
        await loadMessages();
      }
    } catch (error) {
      console.error('Error submitting prescription:', error);
      toast.error(error.response?.data?.message || 'Failed to submit prescription');
    } finally {
      setSubmittingPrescription(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)] bg-gray-900 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-white">Loading consultation room...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)] bg-gray-900 rounded-xl">
        <div className="text-center text-white">
          <p className="text-xl">Consultation room not found</p>
          <button onClick={goBack} className="mt-4 px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isDoctor = consultation.userRole === 'doctor';
  const otherParty = isDoctor ? consultation.patient : consultation.doctor;
  const status = consultation.consultation.status;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-semibold">Consultation Room</h1>
            <p className="text-sm text-gray-400">
              with {otherParty?.name} • {isDoctor ? otherParty?.specialty || 'Patient' : 'Doctor'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">
            {formatDate(consultation.consultation.startedAt)}
          </p>
          <p className={`text-xs font-medium ${status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
            {status === 'active' ? '🟢 Active' : '🔴 Ended'}
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video Area (Placeholder for now) */}
        <div className="flex-1 flex items-center justify-center bg-gray-800 m-4 rounded-xl">
          <div className="text-center text-white">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-gray-500" />
            </div>
            <p className="text-lg font-semibold">{otherParty?.name}</p>
            <p className="text-sm text-gray-400">{isDoctor ? 'Patient' : 'Doctor'}</p>
            {consultationEnded && (
              <p className="mt-4 text-yellow-400">Consultation Ended</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Video call feature coming soon. Use chat for now.
            </p>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 bg-white flex flex-col shadow-xl">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-primary-50">
            <h3 className="font-semibold text-gray-800">Chat</h3>
            <p className="text-xs text-gray-500">
              {messages.length} messages
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <p>No messages yet</p>
                <p className="text-sm mt-2">Start the conversation!</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.senderRole === 'Doctor' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.senderRole === 'Doctor'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-primary-500 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold">
                      {msg.senderRole === 'Doctor' 
                        ? `Dr. ${consultation.doctor?.name || 'Doctor'}`
                        : consultation.patient?.name || 'Patient'}
                    </p>
                    <p className="text-xs opacity-70">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                  
                  {msg.message && <p className="text-sm">{msg.message}</p>}
                  
                  {msg.fileType === 'prescription' && msg.prescription && (
                    <div className="mt-2 p-3 bg-white rounded-lg border border-primary-200 text-gray-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-primary-600 border-b border-primary-100 pb-1">
                        <Clipboard className="w-4 h-4" />
                        <span className="font-bold text-sm uppercase tracking-wider">Prescription</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-bold text-gray-500">DIAGNOSIS</p>
                          <p className="text-sm font-medium">{msg.prescription.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500">MEDICATIONS</p>
                          <ul className="text-xs space-y-1 mt-1">
                            {msg.prescription.medications?.map((med, i) => (
                              <li key={i} className="bg-primary-50 p-1.5 rounded border border-primary-100">
                                <span className="font-bold text-primary-700">{med.name}</span> - {med.dosage} ({med.frequency})
                                {med.instructions && <p className="text-[10px] italic text-gray-600 mt-0.5">Note: {med.instructions}</p>}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {msg.prescription.followUpDate && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 p-1 rounded">
                            <Calendar className="w-3 h-3" />
                            <span>Follow-up: {new Date(msg.prescription.followUpDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {msg.fileUrl && msg.fileType !== 'prescription' && (
                    <button
                      onClick={() => downloadFile(msg.fileUrl, msg.fileName)}
                      className="mt-2 text-sm flex items-center gap-1 underline opacity-90 hover:opacity-100"
                    >
                      <Download className="w-4 h-4" />
                      {msg.fileName}
                    </button>
                  )}
                  
                  <div className="flex justify-end mt-1">
                    {msg.readBy?.length >= 2 && (
                      <CheckCheck className="w-3 h-3 opacity-70" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* File Preview */}
          {selectedFile && (
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-xs text-gray-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                disabled={consultationEnded}
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
              />
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={consultationEnded ? "Consultation ended" : "Type your message..."}
                className="flex-1 input-field"
                disabled={consultationEnded}
              />
              <button
                type="submit"
                disabled={(!newMessage.trim() && !selectedFile) || consultationEnded || sendingFile}
                className="btn-primary p-2"
              >
                {sendingFile ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Controls */}
      {isDoctor && status === 'active' && !consultationEnded && (
        <div className="bg-gray-800 p-4 flex justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </button>
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-full transition ${
              isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
          </button>
          
          <button
            onClick={() => setShowPrescriptionModal(true)}
            className="p-3 rounded-full bg-primary-600 hover:bg-primary-700 transition"
            title="Add Prescription"
          >
            <Clipboard className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={endConsultation}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition"
            title="End Consultation"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-primary-50">
              <div className="flex items-center gap-2 text-primary-700">
                <Clipboard className="w-6 h-6" />
                <h3 className="text-xl font-bold">New Prescription</h3>
              </div>
              <button onClick={() => setShowPrescriptionModal(false)} className="p-2 hover:bg-white rounded-full transition">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={submitPrescription} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Diagnosis</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Viral Fever"
                    className="input-field w-full"
                    value={prescriptionForm.diagnosis}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Follow-up Date</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={prescriptionForm.followUpDate}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, followUpDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="font-bold text-gray-800">Medications</h4>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-bold"
                  >
                    <Plus className="w-4 h-4" /> Add More
                  </button>
                </div>
                
                {prescriptionForm.medications.map((med, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100 relative group">
                    {prescriptionForm.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(idx)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">MEDICINE NAME</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Paracetamol"
                          className="input-field w-full py-1.5"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">DOSAGE</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 500mg"
                          className="input-field w-full py-1.5"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">FREQUENCY</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Twice a day"
                          className="input-field w-full py-1.5"
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(idx, 'frequency', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">DURATION</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5 days"
                          className="input-field w-full py-1.5"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(idx, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">SPECIAL INSTRUCTIONS</label>
                      <input
                        type="text"
                        placeholder="e.g. Take after meals"
                        className="input-field w-full py-1.5"
                        value={med.instructions}
                        onChange={(e) => handleMedicationChange(idx, 'instructions', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Doctor's Notes</label>
                <textarea
                  rows="3"
                  className="input-field w-full"
                  placeholder="Additional advice for the patient..."
                  value={prescriptionForm.notes}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPrescription}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {submittingPrescription ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save & Share
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationRoom;