import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PatientHome from './Patient/PatientHome';
import PatientAppointments from './Patient/PatientAppointments';
import PatientDiagnostics from './Patient/PatientDiagnostics';
import PatientAmbulance from './Patient/PatientAmbulance';
import PatientProfile from './Patient/PatientProfile';
import PatientConsultations from './Patient/PatientConsultations';
import BookAppointment from './Patient/BookAppointment';
import ConsultationRoom from '../components/ConsultationRoom';

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="Patient" />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<PatientHome />} />
            <Route path="/appointments" element={<PatientAppointments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/diagnostics" element={<PatientDiagnostics />} />
            <Route path="/ambulance" element={<PatientAmbulance />} />
            <Route path="/profile" element={<PatientProfile />} />
            <Route path="/consultations" element={<PatientConsultations />} />
            <Route path="/consultations/:roomId" element={<ConsultationRoom />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;