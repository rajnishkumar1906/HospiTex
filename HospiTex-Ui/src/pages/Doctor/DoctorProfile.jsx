import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Stethoscope, Save, Shield, CheckCircle, AlertCircle, Clock, GraduationCap, IdCard, Hospital } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
  const { api, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    verificationRequested: false,
    qualification: '',
    registrationNumber: '',
    hospitalAffiliation: ''
  });
  const [profile, setProfile] = useState({
    specialty: '',
    category: 'general',
    experienceYears: 0,
    appointmentFee: 0,
    location: '',
    state: '',
    district: '',
    about: '',
    contactNumber: '',
    availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  });
  
  const [verificationData, setVerificationData] = useState({
    qualification: '',
    registrationNumber: '',
    hospitalAffiliation: '',
    experienceDetails: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchVerificationStatus();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data.success) {
        const data = response.data.data;
        if (data.profile) {
          setProfile({
            specialty: data.profile.specialty || '',
            category: data.profile.category || 'general',
            experienceYears: data.profile.experienceYears || 0,
            appointmentFee: data.profile.appointmentFee || 0,
            location: data.profile.location || '',
            state: data.profile.state || '',
            district: data.profile.district || '',
            about: data.profile.about || '',
            contactNumber: data.profile.contactNumber || '',
            availability: data.profile.availability || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchVerificationStatus = async () => {
    try {
      const response = await api.get('/doctor/verification-status');
      if (response.data.success) {
        const status = response.data.data;
        setVerificationStatus(status);
        setVerificationData({
          qualification: status.qualification || '',
          registrationNumber: status.registrationNumber || '',
          hospitalAffiliation: status.hospitalAffiliation || '',
          experienceDetails: ''
        });
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/users/profile/doctor', profile);
      if (response.data.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    if (!verificationData.qualification || !verificationData.registrationNumber) {
      toast.error('Please fill in qualification and registration number');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/doctor/request-verification', verificationData);
      if (response.data.success) {
        toast.success('Verification request submitted! Admin will review your credentials.');
        fetchVerificationStatus();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit verification request');
    } finally {
      setLoading(false);
    }
  };

  const availabilityTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  // Check if user is verified
  const isVerified = user?.isVerified || verificationStatus.isVerified;

  return (
    <div className="space-y-6">
      {/* Verified Badge */}
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

      {/* Profile Form */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-500" /> Professional Information
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Specialty *</label>
              <input 
                type="text" 
                value={profile.specialty} 
                onChange={(e) => setProfile({...profile, specialty: e.target.value})} 
                className="input-field" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                value={profile.category} 
                onChange={(e) => setProfile({...profile, category: e.target.value})} 
                className="input-field"
              >
                <option value="general">General Physician</option>
                <option value="specialist">Specialist</option>
                <option value="surgeon">Surgeon</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Experience (Years)</label>
              <input 
                type="number" 
                value={profile.experienceYears} 
                onChange={(e) => setProfile({...profile, experienceYears: parseInt(e.target.value)})} 
                className="input-field" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Appointment Fee (₹)</label>
              <input 
                type="number" 
                value={profile.appointmentFee} 
                onChange={(e) => setProfile({...profile, appointmentFee: parseInt(e.target.value)})} 
                className="input-field" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Number</label>
              <input 
                type="tel" 
                value={profile.contactNumber} 
                onChange={(e) => setProfile({...profile, contactNumber: e.target.value})} 
                className="input-field" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location/Hospital</label>
              <input 
                type="text" 
                value={profile.location} 
                onChange={(e) => setProfile({...profile, location: e.target.value})} 
                className="input-field" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">About</label>
            <textarea 
              value={profile.about} 
              onChange={(e) => setProfile({...profile, about: e.target.value})} 
              className="input-field" 
              rows="3" 
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <Save className="w-4 h-4 inline mr-2" />
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Verification Request Section - Only show if not verified */}
      {!isVerified && !verificationStatus.verificationRequested && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" /> Request Verification
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            Submit your credentials for verification. This helps maintain trust and authenticity.
          </p>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <GraduationCap className="w-4 h-4 inline mr-1" /> Qualification *
                </label>
                <input 
                  type="text" 
                  value={verificationData.qualification} 
                  onChange={(e) => setVerificationData({...verificationData, qualification: e.target.value})} 
                  className="input-field" 
                  placeholder="e.g., MBBS, MD" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <IdCard className="w-4 h-4 inline mr-1" /> Registration Number *
                </label>
                <input 
                  type="text" 
                  value={verificationData.registrationNumber} 
                  onChange={(e) => setVerificationData({...verificationData, registrationNumber: e.target.value})} 
                  className="input-field" 
                  placeholder="Medical Council Registration" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Hospital className="w-4 h-4 inline mr-1" /> Hospital Affiliation
                </label>
                <input 
                  type="text" 
                  value={verificationData.hospitalAffiliation} 
                  onChange={(e) => setVerificationData({...verificationData, hospitalAffiliation: e.target.value})} 
                  className="input-field" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Experience Details</label>
                <textarea 
                  value={verificationData.experienceDetails} 
                  onChange={(e) => setVerificationData({...verificationData, experienceDetails: e.target.value})} 
                  className="input-field" 
                  rows="2" 
                  placeholder="Brief description of your experience" 
                />
              </div>
            </div>
            <button 
              onClick={handleRequestVerification} 
              disabled={loading} 
              className="btn-primary w-full"
            >
              <Shield className="w-4 h-4 inline mr-2" />
              {loading ? 'Submitting...' : 'Submit Verification Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;