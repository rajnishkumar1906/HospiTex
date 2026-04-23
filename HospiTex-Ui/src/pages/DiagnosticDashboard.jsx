import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VerificationWarning from '../components/VerificationWarning';
import { useApp } from '../context/AppContext';

const DiagnosticDashboard = () => {
  const { user } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="Diagnostic" />
        <main className="flex-1 p-6">
          <VerificationWarning user={user} />
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Diagnostic Dashboard</h1>
            <p className="text-gray-600">Welcome {user?.username}!</p>
            {!user?.isVerified && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  ℹ️ You can browse the dashboard while waiting for verification.
                  Once verified by admin, you'll have full access to all features.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DiagnosticDashboard;