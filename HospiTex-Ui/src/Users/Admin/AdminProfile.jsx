import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Auth/AppContext';
import apiClient from '../../config/axios';
import { toast } from 'react-toastify';
import { Shield, User as UserIcon, Mail, Save } from 'lucide-react';
import AdminNavbar from './AdminNavbar';

const AdminProfile = () => {
  const { User } = useContext(AppContext);
  const [formData, setFormData] = useState({
    username: User?.username || '',
    email: User?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (User) {
      setFormData({
        username: User.username || '',
        email: User.email || ''
      });
    }
  }, [User]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await apiClient.put('/api/users/profile', {
        username: formData.username
      });
      if (response.data.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <AdminNavbar />
      <section className="pt-24 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Admin Profile</h2>
            <p className="text-lg text-gray-700">Manage your admin account information</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                {User?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{User?.username || 'Admin'}</h3>
                <p className="text-gray-600">{User?.email || ''}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Administrator
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Role:</span>
                  <span className="ml-2 font-semibold text-gray-900">Administrator</span>
                </div>
                <div>
                  <span className="text-gray-600">Account Status:</span>
                  <span className="ml-2 font-semibold text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;

