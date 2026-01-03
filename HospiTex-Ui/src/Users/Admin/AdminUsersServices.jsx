import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../../config/axios';
import { toast } from 'react-toastify';
import { Users, UserCheck, Trash2, Shield, Search, Filter, Eye } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import VerificationReviewModal from './VerificationReviewModal';

const AdminUsersServices = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewUser, setReviewUser] = useState(null);
  const [reviewProfile, setReviewProfile] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      params.append('page', page);
      params.append('limit', 10);

      const response = await apiClient.get(`/api/admin/users?${params}`);
      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await apiClient.delete(`/api/admin/users/${userId}`);
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await apiClient.get(`/api/admin/users/${userId}`);
      if (response.data.success) {
        setReviewUser(response.data.user);
        setReviewProfile(response.data.profile);
        setShowReviewModal(true);
      }
    } catch (error) {
      toast.error('Failed to fetch user details');
    }
  };

  const handleVerify = async (userId, isVerified) => {
    try {
      const response = await apiClient.patch(`/api/admin/users/${userId}/status`, {
        isAccountVerified: isVerified
      });
      if (response.data.success) {
        fetchUsers();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      throw error;
    }
  };

  const handleReject = async (userId, isVerified) => {
    return handleVerify(userId, isVerified);
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Doctor':
        return <Shield className="w-5 h-5 text-green-600" />;
      case 'Patient':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'Diagnostic':
        return <Users className="w-5 h-5 text-indigo-600" />;
      case 'Admin':
        return <Shield className="w-5 h-5 text-purple-600" />;
      default:
        return <Users className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Doctor':
        return 'bg-green-100 text-green-800';
      case 'Patient':
        return 'bg-blue-100 text-blue-800';
      case 'Diagnostic':
        return 'bg-indigo-100 text-indigo-800';
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <AdminNavbar />
      <section className="pt-24 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-purple-900 mb-2">User Management</h2>
            <p className="text-lg text-gray-700 mb-2">Manage all users in the system</p>
            <p className="text-sm text-gray-500">Note: Only Doctors and Diagnostics require verification. Patients are auto-verified.</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                >
                  <option value="">All Roles</option>
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Diagnostic">Diagnostic</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <Link
                to="/admin-dashboard/users"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                Back to Overview
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">User</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Verification</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-purple-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-sm">
                                  {user.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="font-medium text-gray-900 text-sm">{user.username}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{user.email}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {getRoleIcon(user.role)}
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {/* Only show verification for Doctors and Diagnostics */}
                              {(user.role === 'Doctor' || user.role === 'Diagnostic') ? (
                                user.isAccountVerified ? (
                                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-800">
                                    ✓ Verified
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => fetchUserDetails(user._id)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500 text-white hover:bg-yellow-600 shadow transition-all flex items-center gap-1"
                                    title="Review and verify"
                                  >
                                    <Eye className="w-3 h-3" />
                                    Review & Verify
                                  </button>
                                )
                              ) : (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                  Auto
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-purple-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white border border-purple-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Verification Review Modal */}
      <VerificationReviewModal
        user={reviewUser}
        profile={reviewProfile}
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setReviewUser(null);
          setReviewProfile(null);
        }}
        onVerify={handleVerify}
        onReject={handleReject}
      />
    </div>
  );
};

export default AdminUsersServices;

