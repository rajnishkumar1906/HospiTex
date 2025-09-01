import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from './Auth/AppContext';
import { ToastContainer } from 'react-toastify';

// ✅ CommonDashboard and Login pages
import Login from './Auth/Login';
import CommonDashboard from './pages/commonDashboard'

// ✅ Patient Imports
import PatientNavbar from './Users/Patient/PatientNavbar';
import HomePage from './Users/Patient/HomePage';
import PatientRegistration from './Users/Patient/PatientRegistration';
import UserProfile from './Users/Patient/UserProfile';
import DiagnosticServices from './Users/Patient/Services/DiagnosticServices';
import AppointmentServices from './Users/Patient/Services/appointmentService';
import AmbulanceServices from './Users/Patient/Services/AmbulanceServices';

// ✅ Doctor Imports
import DoctorNavbar from './Users/Doctor/DoctorNavbar';
import DoctorHomePage from './Users/Doctor/DoctorHomePage';
import DoctorAppointmentServices from './Users/Doctor/DoctorAppointmentServices';
import DoctorPatientRecordsServices from './Users/Doctor/DoctorPatientRecordsServices';

// ✅ Diagnostic Imports
import DiagnosticNavbar from './Users/Diagnostic/DiagnosticNavbar';
import DiagnosticHomePage from './Users/Diagnostic/DiagnosticHomePage';
import DiagnosticReportsServices from './Users/Diagnostic/DiagnosticReportsServices';
import DiagnosticTestsServices from './Users/Diagnostic/DiagnosticTestsServices';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { IsLoggedIn, UserRole } = useContext(AppContext);

  // ✅ Auto-redirect logged-in users away from login page
  useEffect(() => {
    if (!IsLoggedIn) return;

    if (UserRole === 'Patient' && !location.pathname.startsWith('/patient-dashboard'))
      navigate('/patient-dashboard');
    else if (UserRole === 'Doctor' && !location.pathname.startsWith('/doctor-dashboard'))
      navigate('/doctor-dashboard');
    else if (UserRole === 'Diagnostic' && !location.pathname.startsWith('/diagnostic-dashboard'))
      navigate('/diagnostic-dashboard');
  }, [IsLoggedIn, UserRole, location.pathname, navigate]);

  // ✅ Role-based route detection
  const isPatientRoute = location.pathname.startsWith('/patient-dashboard');
  const isDoctorRoute = location.pathname.startsWith('/doctor-dashboard');
  const isDiagnosticRoute = location.pathname.startsWith('/diagnostic-dashboard');

  // ✅ Allowed home paths
  const patientHomePaths = [
    '/patient-dashboard',
    '/patient-dashboard/appointment-booking',
    '/patient-dashboard/diagnostic',
    '/patient-dashboard/ambulance',
    '/patient-dashboard/contacts',
  ];

  const doctorHomePaths = [
    '/doctor-dashboard',
    '/doctor-dashboard/booked-appointments',
    '/doctor-dashboard/records',
    '/doctor-dashboard/doctor-contacts',
    '/doctor-dashboard/profile',
  ];

  const diagnosticHomePaths = [
    '/diagnostic-dashboard',
    '/diagnostic-dashboard/reports',
    '/diagnostic-dashboard/tests',
    '/diagnostic-dashboard/contacts',
    '/diagnostic-dashboard/profile',
  ];

  // ✅ Check if current route is home section
  const isPatientHome = patientHomePaths.includes(location.pathname);
  const isDoctorHome = doctorHomePaths.includes(location.pathname);
  const isDiagnosticHome = diagnosticHomePaths.includes(location.pathname);

  // ✅ Render navbar based on role route
  const renderNavbar = () => {
    if (!IsLoggedIn) return null;
    if (isPatientRoute && UserRole === 'Patient') return <PatientNavbar />;
    if (isDoctorRoute && UserRole === 'Doctor') return <DoctorNavbar />;
    if (isDiagnosticRoute && UserRole === 'Diagnostic') return <DiagnosticNavbar />;
    return null;
  };

  // ✅ Protect routes based on login and role
  const PrivateRoute = ({ children, role }) => {
    if (!IsLoggedIn || UserRole !== role) {
      return <Navigate to="/" replace />; // Redirect to login
    }
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 scroll-smooth">
      {renderNavbar()}

      <div className={isPatientRoute || isDoctorRoute || isDiagnosticRoute ? 'mt-20' : ''}>
        <Routes>
          {/* ======================= CommonDashboard And Login Route ======================= */}
          <Route path='/login' element={<Login />} />
          <Route path="/" element={<CommonDashboard />} />

          {/* ======================= Patient Routes ======================= */}
          <Route
            path="/patient-dashboard/*"
            element={
              <PrivateRoute role="Patient">
                {isPatientHome ? <HomePage /> : <Navigate to="/patient-dashboard" replace />}
              </PrivateRoute>
            }
          />
          <Route
            path="/patient-dashboard/patientReg"
            element={
              <PrivateRoute role="Patient">
                <PatientRegistration />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient-dashboard/userprofile"
            element={
              <PrivateRoute role="Patient">
                <UserProfile />
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

          {/* ======================= Doctor Routes ======================= */}
          <Route
            path="/doctor-dashboard/*"
            element={
              <PrivateRoute role="Doctor">
                {isDoctorHome ? <DoctorHomePage /> : <Navigate to="/doctor-dashboard" replace />}
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

          {/* ======================= Diagnostic Routes ======================= */}
          <Route
            path="/diagnostic-dashboard/*"
            element={
              <PrivateRoute role="Diagnostic">
                {isDiagnosticHome ? <DiagnosticHomePage /> : <Navigate to="/diagnostic-dashboard" replace />}
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
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
}

export default App;
