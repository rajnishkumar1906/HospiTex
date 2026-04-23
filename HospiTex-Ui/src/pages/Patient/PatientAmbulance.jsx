import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

const PatientAmbulance = () => {
  const { api, user } = useApp();
  const [requests, setRequests] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    destination: '',
    emergencyType: 'General',
    patientName: user?.username || '',
    contactNumber: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/ambulance/patient/requests');
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching ambulance requests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/ambulance/request', formData);
      if (response.data.success) {
        toast.success('Ambulance requested successfully!');
        setShowRequest(false);
        fetchRequests();
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request ambulance');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pickupLocation: '',
      destination: '',
      emergencyType: 'General',
      patientName: user?.username || '',
      contactNumber: '',
      notes: ''
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Dispatched': 'bg-blue-100 text-blue-700',
      'In Transit': 'bg-purple-100 text-purple-700',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors['Pending']}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Ambulance Services</h2>
        <button onClick={() => setShowRequest(true)} className="btn-primary bg-red-600 hover:bg-red-700">
          <Truck className="w-4 h-4 inline mr-2" /> Request Ambulance
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">My Requests</h3>
          {requests.length === 0 ? (
            <div className="card text-center py-8">
              <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No ambulance requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req._id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="font-medium">{req.emergencyType}</span>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>From: {req.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>To: {req.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{req.contactNumber}</span>
                    </div>
                    {req.estimatedTime && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="w-4 h-4" />
                        <span>ETA: {req.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card bg-red-50">
          <h3 className="font-semibold text-red-800 mb-2">Emergency?</h3>
          <p className="text-sm text-red-600 mb-4">For life-threatening emergencies, call 108 immediately</p>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">108</div>
            <p className="text-xs text-gray-500 mt-2">24/7 Emergency Helpline</p>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Request Ambulance</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pickup Location *</label>
                <input type="text" value={formData.pickupLocation} onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Destination *</label>
                <input type="text" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Emergency Type *</label>
                <select value={formData.emergencyType} onChange={(e) => setFormData({...formData, emergencyType: e.target.value})} className="input-field">
                  <option>General</option>
                  <option>Medical</option>
                  <option>Accident</option>
                  <option>Cardiac</option>
                  <option>Pregnancy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number *</label>
                <input type="tel" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="input-field" rows="3"></textarea>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 btn-primary bg-red-600 hover:bg-red-700">{loading ? 'Requesting...' : 'Request Ambulance'}</button>
                <button type="button" onClick={() => setShowRequest(false)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAmbulance;
