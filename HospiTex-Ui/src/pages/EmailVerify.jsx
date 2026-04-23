import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, CheckCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { api } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-account', { otp });
      if (response.data.success) {
        toast.success('Email verified successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await api.post('/auth/send-verify-otp');
      if (response.data.success) {
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Activity className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary-600">Verify Email</h1>
          <p className="text-gray-600 mt-2">Enter the OTP sent to your email</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="input-field pl-10" placeholder="Enter 6-digit OTP" maxLength="6" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={resendOtp} className="text-primary-600 hover:text-primary-700 text-sm">Resend OTP</button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
