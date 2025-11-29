import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './Auth/AppContext';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Components imports...
import Login from './Auth/Login';
import CommonDashboard from './pages/commonDashboard'

// Patient Imports
import HomePage from './Users/Patient/HomePage';
import PatientProfile from './Users/Patient/PatientProfile';
import DiagnosticServices from './Users/Patient/Services/DiagnosticServices';
import AppointmentServices from './Users/Patient/Services/appointmentService';
import AmbulanceServices from './Users/Patient/Services/AmbulanceServices';
import AppointmentHistory from './Users/Patient/AppointmentHistory';

// Doctor Imports
import DoctorHomePage from './Users/Doctor/DoctorHomePage';
import DoctorAppointmentServices from './Users/Doctor/DoctorAppointmentServices';
import DoctorPatientRecordsServices from './Users/Doctor/DoctorPatientRecordsServices';
import DoctorProfile from './Users/Doctor/DoctorProfile';

// Diagnostic Imports
import DiagnosticHomePage from './Users/Diagnostic/DiagnosticHomePage';
import DiagnosticReportsServices from './Users/Diagnostic/DiagnosticReportsServices';
import DiagnosticTestsServices from './Users/Diagnostic/DiagnosticTestsServices';
import DiagnosticProfile from './Users/Diagnostic/DiagnosticProfile';

function App() {
  const { IsLoggedIn, UserRole, authLoading } = useContext(AppContext);

  // REMOVED: The problematic useEffect that caused redirect loops

  // Protected Route Component
  const PrivateRoute = ({ children, role }) => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    if (!IsLoggedIn || UserRole !== role) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 scroll-smooth">
      {/* REMOVED: renderNavbar() - Navbars are now inside their respective pages */}
      
      <Routes>
        {/* ======================= Public Routes ======================= */}
        <Route path='/login' element={<Login />} />
        <Route path="/" element={<CommonDashboard />} />

        {/* ======================= Patient Routes ======================= */}
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute role="Patient">
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard/appointment-booking"
          element={
            <PrivateRoute role="Patient">
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard/diagnostic"
          element={
            <PrivateRoute role="Patient">
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard/ambulance"
          element={
            <PrivateRoute role="Patient">
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard/contacts"
          element={
            <PrivateRoute role="Patient">
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard/patientprofile"
          element={
            <PrivateRoute role="Patient">
              <PatientProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard/diagnostic-services"
          element={
            <PrivateRoute role="Patient">
              <DiagnosticServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard/appointment-services"
          element={
            <PrivateRoute role="Patient">
              <AppointmentServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard/ambulance-services"
          element={
            <PrivateRoute role="Patient">
              <AmbulanceServices />
            </PrivateRoute>
          }
        />
        <Route
          path='/patient-dashboard/appointment-history'
          element={
            <PrivateRoute role="Patient">
              <AppointmentHistory />
            </PrivateRoute>
          }
        />

        {/* ======================= Doctor Routes ======================= */}
        <Route
          path="/doctor-dashboard"
          element={
            <PrivateRoute role="Doctor">
              <DoctorHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-dashboard/booked-appointments"
          element={
            <PrivateRoute role="Doctor">
              <DoctorHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-dashboard/records"
          element={
            <PrivateRoute role="Doctor">
              <DoctorHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-dashboard/doctor-contacts"
          element={
            <PrivateRoute role="Doctor">
              <DoctorHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-dashboard/appointment-services"
          element={
            <PrivateRoute role="Doctor">
              <DoctorAppointmentServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-dashboard/patient-records"
          element={
            <PrivateRoute role="Doctor">
              <DoctorPatientRecordsServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-dashboard/profile"
          element={
            <PrivateRoute role="Doctor">
              <DoctorProfile />
            </PrivateRoute>
          }
        />

        {/* ======================= Diagnostic Routes ======================= */}
        <Route
          path="/diagnostic-dashboard"
          element={
            <PrivateRoute role="Diagnostic">
              <DiagnosticHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic-dashboard/reports"
          element={
            <PrivateRoute role="Diagnostic">
              <DiagnosticHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic-dashboard/tests"
          element={
            <PrivateRoute role="Diagnostic">
              <DiagnosticHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic-dashboard/contacts"
          element={
            <PrivateRoute role="Diagnostic">
              <DiagnosticHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic-dashboard/diagnostic-profile"
          element={
            <PrivateRoute role="Diagnostic">
              <DiagnosticProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic-dashboard/reports-services"
          element={
            <PrivateRoute role="Diagnostic">
              <DiagnosticReportsServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic-dashboard/tests-services"
          element={
            <PrivateRoute role="Diagnostic">
              <DiagnosticTestsServices />
            </PrivateRoute>
          }
        />

        {/* ======================= Default Route ======================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;