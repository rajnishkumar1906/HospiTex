import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, User, Mail, Phone, MapPin, Award, Clock, DollarSign, FileText, Shield } from 'lucide-react';
import apiClient from '../../config/axios';
import { toast } from 'react-toastify';

const VerificationReviewModal = ({ user, profile, isOpen, onClose, onVerify, onReject }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleVerify = async () => {
    if (!window.confirm(`Are you sure you want to verify ${user.username}?`)) return;
    
    setLoading(true);
    try {
      await onVerify(user._id, true);
      toast.success(`${user.role} verified successfully`);
      onClose();
    } catch (error) {
      toast.error('Failed to verify user');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    setLoading(true);
    try {
      await onReject(user._id, false);
      toast.success(`${user.role} verification rejected`);
      onClose();
    } catch (error) {
      toast.error('Failed to reject user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Review {user.role} for Verification</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Basic Info */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Username</label>
                <p className="text-gray-900 font-medium">{user.username}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Role</label>
                <p className="text-gray-900 font-medium">{user.role}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Account Created</label>
                <p className="text-gray-900 font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Specific Info */}
          {user.role === 'Doctor' && profile && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Doctor Credentials & Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Specialty</label>
                  <p className="text-gray-900 font-medium">{profile.specialty || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Category</label>
                  <p className="text-gray-900 font-medium capitalize">{profile.category || 'General'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Experience
                  </label>
                  <p className="text-gray-900 font-medium">
                    {profile.experienceYears || 0} {profile.experienceYears === 1 ? 'year' : 'years'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Appointment Fee
                  </label>
                  <p className="text-gray-900 font-medium">₹{profile.appointmentFee || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <p className="text-gray-900 font-medium">{profile.location || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Contact Number
                  </label>
                  <p className="text-gray-900 font-medium">{profile.contactNumber || 'Not provided'}</p>
                </div>
                {profile.availability && profile.availability.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Available Time Slots</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.availability.map((slot, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.about && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">About</label>
                    <p className="text-gray-900 mt-2 bg-white p-3 rounded-lg border border-green-200">
                      {profile.about}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Verification Checklist */}
              <div className="mt-6 pt-6 border-t border-green-300">
                <h4 className="font-bold text-gray-900 mb-3">Verification Checklist</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Credentials and qualifications verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Contact information verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Professional details reviewed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">All required information provided</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostic Specific Info */}
          {user.role === 'Diagnostic' && profile && (
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Diagnostic Center Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Center Name</label>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Account Information</label>
                  <p className="text-gray-700 mt-1">
                    Diagnostic center registered on {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="mt-6 pt-6 border-t border-indigo-300">
                <h4 className="font-bold text-gray-900 mb-3">Verification Checklist</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-700">Center registration verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-700">Contact information verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-700">All required information provided</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-5 h-5" />
              Reject Verification
            </button>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              {loading ? 'Verifying...' : 'Approve & Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationReviewModal;

