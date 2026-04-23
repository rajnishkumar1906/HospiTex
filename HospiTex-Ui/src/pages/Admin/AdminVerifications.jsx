import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, AlertCircle, UserCheck, Shield, Stethoscope, Eye, FileText, Award, IdCard, Hospital } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminVerifications = () => {
  const { api } = useApp();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/verifications/pending');
      if (response.data.success) {
        setPendingUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      toast.error('Failed to load pending verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, isVerified) => {
    setProcessingId(userId);
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { 
        isAccountVerified: isVerified 
      });
      if (response.data.success) {
        toast.success(`User ${isVerified ? 'verified' : 'rejected'} successfully`);
        fetchPendingVerifications();
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update verification status');
    } finally {
      setProcessingId(null);
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
          <h2 className="text-2xl font-bold text-gray-800">Pending Verifications</h2>
          <p className="text-gray-500 text-sm mt-1">Review and verify new doctor and diagnostic center accounts</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          {pendingUsers.length} Pending
        </div>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="card text-center py-12">
          <UserCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">No Pending Verifications</h3>
          <p className="text-gray-500 mt-2">All users have been verified</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map((user) => (
            <div key={user._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    user.role === 'Doctor' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {user.role === 'Doctor' ? (
                      <Stethoscope className="w-7 h-7 text-blue-600" />
                    ) : (
                      <AlertCircle className="w-7 h-7 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.username}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Doctor' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {user.role}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        {user.state}
                      </span>
                      {user.district && (
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          {user.district}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setSelectedUser(selectedUser?._id === user._id ? null : user)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleVerify(user._id, true)}
                    disabled={processingId === user._id}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {processingId === user._id ? 'Processing...' : 'Verify'}
                  </button>
                  <button
                    onClick={() => handleVerify(user._id, false)}
                    disabled={processingId === user._id}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Expanded Details Section */}
              {selectedUser?._id === user._id && user.profile && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Verification Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {user.role === 'Doctor' && (
                      <>
                        <div className="flex items-start gap-2">
                          <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Qualification</p>
                            <p className="text-sm font-medium">{user.profile.qualification || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <IdCard className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Registration Number</p>
                            <p className="text-sm font-medium">{user.profile.registrationNumber || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Hospital className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Hospital Affiliation</p>
                            <p className="text-sm font-medium">{user.profile.hospitalAffiliation || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Stethoscope className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Specialty</p>
                            <p className="text-sm font-medium">{user.profile.specialty || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Experience</p>
                            <p className="text-sm font-medium">{user.profile.experienceYears || 0} years</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 mb-1">Experience Details</p>
                          <p className="text-sm">{user.profile.experienceDetails || 'Not provided'}</p>
                        </div>
                      </>
                    )}
                    {user.role === 'Diagnostic' && (
                      <>
                        <div className="flex items-start gap-2">
                          <Hospital className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Center Name</p>
                            <p className="text-sm font-medium">{user.profile.centerName || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="text-sm font-medium">{user.profile.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    Requested on: {new Date(user.createdAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerifications;