import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Patient imports
import PatientNavbar from './Users/Patient/PatientNavbar';
import HomePage from './Users/Patient/HomePage';
import PatientRegistration from './Users/Patient/PatientRegistration';
import UserProfile from './Users/Patient/UserProfile';
import DiagnosticServices from './Users/Patient/Services/DiagnosticServices';
import AppointmentServices from './Users/Patient/Services/appointmentService';
import AmbulanceServices from './Users/Patient/Services/AmbulanceServices';

// Doctor imports
import DoctorNavbar from './Users/Doctor/DoctorNavbar';
import DoctorHomePage from './Users/Doctor/DoctorHomePage';

function App() {
  const location = useLocation();

  // Patient routes home pages
  const patientHomePaths = [
    '/patient-dashboard',
    '/patient-dashboard/appointment-booking',
    '/patient-dashboard/diagnostic',
    '/patient-dashboard/ambulance',
    '/patient-dashboard/contacts',
  ];
  const isPatientHome = patientHomePaths.includes(location.pathname);

  // Doctor routes home pages (all these paths load the SPA DoctorHomePage)
  const doctorHomePaths = [
    '/doctor-dashboard',
    '/doctor-dashboard/appointments',
    '/doctor-dashboard/patient-records',
    '/doctor-dashboard/profile',
  ];
  const isDoctorHome = doctorHomePaths.includes(location.pathname);

  // Determine if we are in patient or doctor section based on path prefix
  const isPatientRoute = location.pathname.startsWith('/patient-dashboard');
  const isDoctorRoute = location.pathname.startsWith('/doctor-dashboard');

  return (
    <div className="min-h-screen flex flex-col scroll-smooth bg-gray-50">

      {/* Show correct Navbar */}
      {isPatientRoute && <PatientNavbar />}
      {isDoctorRoute && <DoctorNavbar />}

      <div className="mt-20 px-4">
        <Routes>

          {/* Patient Routes */}
          {isPatientRoute && (
            <>
              {isPatientHome && <Route path="/patient-dashboard/*" element={<HomePage />} />}

              <Route path="/patient-dashboard/patientReg" element={<PatientRegistration />} />
              <Route path="/patient-dashboard/userprofile" element={<UserProfile />} />
              <Route path="/patient-dashboard/diagnostic-services" element={<DiagnosticServices />} />
              <Route path="/patient-dashboard/appointment-services" element={<AppointmentServices />} />
              <Route path="/patient-dashboard/ambulance-services" element={<AmbulanceServices />} />

              {/* Redirect unmatched patient routes to patient home */}
              <Route
                path="/patient-dashboard/*"
                element={<Navigate to="/patient-dashboard" replace />}
              />
            </>
          )}

          {/* Doctor Routes */}
          {isDoctorRoute && (
            <>
              {/* All doctor home paths handled inside DoctorHomePage via scrolling */}
              {isDoctorHome && <Route path="/doctor-dashboard/*" element={<DoctorHomePage />} />}

              {/* Redirect unmatched doctor routes to doctor home */}
              <Route
                path="/doctor-dashboard/*"
                element={<Navigate to="/doctor-dashboard" replace />}
              />
            </>
          )}

          {/* Catch-all redirect: if route doesn't match any above */}
          <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
