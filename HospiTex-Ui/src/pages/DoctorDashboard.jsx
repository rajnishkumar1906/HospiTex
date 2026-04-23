import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DoctorHome from './Doctor/DoctorHome';
import DoctorAppointments from './Doctor/DoctorAppointments';
import DoctorPatients from './Doctor/DoctorPatients';
import DoctorProfile from './Doctor/DoctorProfile';
import DoctorConsultations from './Doctor/DoctorConsultations';
import ConsultationRoom from '../components/ConsultationRoom';

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="Doctor" />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<DoctorHome />} />
            <Route path="/appointments" element={<DoctorAppointments />} />
            <Route path="/patients" element={<DoctorPatients />} />
            <Route path="/profile" element={<DoctorProfile />} />
            <Route path="/consultations" element={<DoctorConsultations />} />
            <Route path="/consultations/:roomId" element={<ConsultationRoom />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;