import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Plus, User, Calendar, Clock, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorPrescriptions = () => {
  const { api } = useApp();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: '',
    followUpDate: ''
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions/doctor/all');
      if (response.data.success) {
        setPrescriptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/appointments/doctor/all');
      if (response.data.success) {
        const uniquePatients = {};
        response.data.data.forEach(apt => {
          if (apt.patient && !uniquePatients[apt.patient._id]) {
            uniquePatients[apt.patient._id] = apt.patient;
          }
        });
        setPatients(Object.values(uniquePatients));
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const removeMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: newMedications });
  };

  const updateMedication = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index][field] = value;
    setFormData({ ...formData, medications: newMedications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      toast.error('Please select a patient');
      return;
    }
    if (!formData.medications[0].name) {
      toast.error('Please add at least one medication');
      return;
    }
    
    try {
      const response = await api.post('/prescriptions/create', formData);
      if (response.data.success) {
        toast.success('Prescription created successfully');
        setShowModal(false);
        fetchPrescriptions();
        setFormData({
          patientId: '',
          diagnosis: '',
          medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
          notes: '',
          followUpDate: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Prescriptions</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and create patient prescriptions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Prescription
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">No Prescriptions Yet</h3>
          <p className="text-gray-500 mt-2">Create your first prescription for a patient.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((pres) => (
            <div key={pres._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold">{pres.patient?.username || 'Unknown Patient'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(pres.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => setSelectedPrescription(pres)}
                    className="text-primary-500 hover:text-primary-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {pres.diagnosis && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Diagnosis:</strong> {pres.diagnosis}
                </p>
              )}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">Medications:</p>
                {pres.medications.slice(0, 2).map((med, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded-lg text-sm">
                    <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency}
                  </div>
                ))}
                {pres.medications.length > 2 && (
                  <p className="text-xs text-gray-400">+ {pres.medications.length - 2} more medications</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Prescription Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Prescription Details</h3>
              <button onClick={() => setSelectedPrescription(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-semibold">{selectedPrescription.patient?.username}</p>
              </div>
              {selectedPrescription.diagnosis && (
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Diagnosis</p>
                  <p>{selectedPrescription.diagnosis}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 mb-2">Medications</p>
                <div className="space-y-2">
                  {selectedPrescription.medications.map((med, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm">Dosage: {med.dosage} | Frequency: {med.frequency} | Duration: {med.duration}</p>
                      {med.instructions && <p className="text-sm text-gray-500 mt-1">Instructions: {med.instructions}</p>}
                    </div>
                  ))}
                </div>
              </div>
              {selectedPrescription.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm">{selectedPrescription.notes}</p>
                </div>
              )}
              {selectedPrescription.followUpDate && (
                <div>
                  <p className="text-sm text-gray-500">Follow-up Date</p>
                  <p>{new Date(selectedPrescription.followUpDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">New Prescription</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Patient *</label>
                <select 
                  value={formData.patientId} 
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})} 
                  className="input-field" 
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.username}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Diagnosis</label>
                <textarea 
                  value={formData.diagnosis} 
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} 
                  className="input-field" 
                  rows="2" 
                  placeholder="Enter diagnosis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Medications *</label>
                {formData.medications.map((med, idx) => (
                  <div key={idx} className="border p-3 rounded-lg mb-3 bg-gray-50">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input 
                        type="text" 
                        placeholder="Medicine Name *" 
                        value={med.name} 
                        onChange={(e) => updateMedication(idx, 'name', e.target.value)} 
                        className="input-field text-sm" 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Dosage (e.g., 500mg)" 
                        value={med.dosage} 
                        onChange={(e) => updateMedication(idx, 'dosage', e.target.value)} 
                        className="input-field text-sm" 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Frequency (e.g., Twice daily)" 
                        value={med.frequency} 
                        onChange={(e) => updateMedication(idx, 'frequency', e.target.value)} 
                        className="input-field text-sm" 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Duration (e.g., 7 days)" 
                        value={med.duration} 
                        onChange={(e) => updateMedication(idx, 'duration', e.target.value)} 
                        className="input-field text-sm" 
                        required 
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Special Instructions (optional)" 
                      value={med.instructions} 
                      onChange={(e) => updateMedication(idx, 'instructions', e.target.value)} 
                      className="input-field text-sm mb-2" 
                    />
                    {formData.medications.length > 1 && (
                      <button type="button" onClick={() => removeMedication(idx)} className="text-red-500 text-sm">Remove</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addMedication} className="text-primary-500 text-sm hover:underline">
                  + Add Another Medicine
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea 
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                  className="input-field" 
                  rows="2" 
                  placeholder="Any additional instructions for the patient"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Follow-up Date (Optional)</label>
                <input 
                  type="date" 
                  value={formData.followUpDate} 
                  onChange={(e) => setFormData({...formData, followUpDate: e.target.value})} 
                  className="input-field" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">Create Prescription</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;