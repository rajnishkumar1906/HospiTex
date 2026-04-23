import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';

const VerificationWarning = ({ user }) => {
  if (!user) return null;
  
  if ((user.role === 'Doctor' || user.role === 'Diagnostic') && !user.isVerified) {
    return (
      <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg animate-fade-in">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800">Account Pending Verification</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your account is awaiting admin verification. While you can access the dashboard,
              some features may be limited until your account is verified.
              You will receive an email notification once verified.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-600">Verification in progress</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default VerificationWarning;