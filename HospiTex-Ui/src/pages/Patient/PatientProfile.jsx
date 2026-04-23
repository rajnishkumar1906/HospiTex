import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Droplet, Heart, Calendar, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const { api, user } = useApp();
  const [profile, setProfile] = useState({
    phone: '',
    age: '',
    gender: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    medicalHistory: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data.success) {
        const userData = response.data.data;
        setProfile({
          phone: userData.profile?.phone || '',
          age: userData.profile?.age || '',
          gender: userData.profile?.gender || '',
          address: userData.profile?.address || '',
          bloodGroup: userData.profile?.bloodGroup || '',
          emergencyContact: userData.profile?.emergencyContact || '',
          medicalHistory: userData.profile?.medicalHistory || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/users/profile/patient', profile);
      if (response.data.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" /> Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={user?.username} disabled className="input-field bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={user?.email} disabled className="input-field bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="number" value={profile.age} onChange={(e) => setProfile({...profile, age: e.target.value})} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select value={profile.gender} onChange={(e) => setProfile({...profile, gender: e.target.value})} className="input-field">
                <option value="">Select Gender</option>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Blood Group</label>
              <div className="relative">
                <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select value={profile.bloodGroup} onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})} className="input-field pl-10">
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-500" /> Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} className="input-field" rows="3"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Emergency Contact</label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="tel" value={profile.emergencyContact} onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})} className="input-field pl-10" placeholder="Emergency contact number" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Medical History</h3>
          <textarea value={profile.medicalHistory} onChange={(e) => setProfile({...profile, medicalHistory: e.target.value})} className="input-field" rows="4" placeholder="Any past medical conditions, allergies, surgeries, etc."></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full btn-primary">
          <Save className="w-4 h-4 inline mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default PatientProfile;
