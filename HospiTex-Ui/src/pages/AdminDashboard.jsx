import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminHome from './Admin/AdminHome';
import AdminUsers from './Admin/AdminUsers';
import AdminVerifications from './Admin/AdminVerifications';
import AdminProfile from './Admin/AdminProfile';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="Admin" />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/verifications" element={<AdminVerifications />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;