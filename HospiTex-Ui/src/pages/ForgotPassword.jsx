import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, ArrowLeft, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { api, backendError } = useApp();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/send-reset-otp', { email });
      if (response.data.success) {
        setOtpSent(true);
        setStep(2);
        toast.success('OTP sent to your email!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      
      if (response.data.success) {
        toast.success('Password reset successfully! Please login with your new password.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Activity className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary-600">HospiTex</h1>
          <p className="text-gray-600 mt-2">
            {step === 1 ? 'Reset your password' : 'Enter OTP and new password'}
          </p>
        </div>

        {backendError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Cannot connect to server. Please make sure backend is running on port 5000</span>
          </div>
        )}

        {step === 1 ? (
          // Step 1: Email Form
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your registered email"
                  required
                  disabled={backendError}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll send a 6-digit OTP to your email for verification
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || backendError}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send Reset OTP'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-primary-600 hover:text-primary-700 text-sm flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          // Step 2: OTP and New Password Form
          <form onSubmit={handleResetPassword} className="space-y-6">
            {otpSent && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">OTP sent to {email}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
                disabled={backendError}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit OTP sent to your email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="Enter new password (min 6 characters)"
                required
                disabled={backendError}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Confirm new password"
                required
                disabled={backendError}
              />
            </div>

            <button
              type="submit"
              disabled={loading || backendError}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                ← Back to email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;