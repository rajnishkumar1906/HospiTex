// // import React from 'react';
// // import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// // // ✅ Patient Imports
// // import PatientNavbar from './Users/Patient/PatientNavbar';
// // import HomePage from './Users/Patient/HomePage';
// // import PatientRegistration from './Users/Patient/PatientRegistration';
// // import UserProfile from './Users/Patient/UserProfile';
// // import DiagnosticServices from './Users/Patient/Services/DiagnosticServices';
// // import AppointmentServices from './Users/Patient/Services/appointmentService';
// // import AmbulanceServices from './Users/Patient/Services/AmbulanceServices';

// // // ✅ Doctor Imports
// // import DoctorNavbar from './Users/Doctor/DoctorNavbar';
// // import DoctorHomePage from './Users/Doctor/DoctorHomePage';
// // import DoctorAppointmentServices from './Users/Doctor/DoctorAppointmentServices';
// // import DoctorPatientRecordsServices from './Users/Doctor/DoctorPatientRecordsServices';

// // // ✅ Diagnostic Imports (new)
// // import DiagnosticNavbar from './Users/Diagnostic/DiagnosticNavbar';
// // import DiagnosticHomePage from './Users/Diagnostic/DiagnosticHomePage';
// // import DiagnosticReportsServices from './Users/Diagnostic/DiagnosticReportsServices';
// // import DiagnosticTestsServices from './Users/Diagnostic/DiagnosticTestsServices';

// // function App() {
// //   const location = useLocation();

// //   // ✅ Role-based route detection
// //   const isPatientRoute = location.pathname.startsWith('/patient-dashboard');
// //   const isDoctorRoute = location.pathname.startsWith('/doctor-dashboard');
// //   const isDiagnosticRoute = location.pathname.startsWith('/diagnostic-dashboard');

// //   // ✅ Allowed home paths
// //   const patientHomePaths = [
// //     '/patient-dashboard',
// //     '/patient-dashboard/appointment-booking',
// //     '/patient-dashboard/diagnostic',
// //     '/patient-dashboard/ambulance',
// //     '/patient-dashboard/contacts',
// //   ];

// //   const doctorHomePaths = [
// //     '/doctor-dashboard',
// //     '/doctor-dashboard/booked-appointments',
// //     '/doctor-dashboard/records',
// //     '/doctor-dashboard/doctor-contacts',
// //     '/doctor-dashboard/profile',
// //   ];

// //   const diagnosticHomePaths = [
// //     '/diagnostic-dashboard',
// //     '/diagnostic-dashboard/reports-services',
// //     '/diagnostic-dashboard/tests-services',
// //     '/diagnostic-dashboard/contact',
// //     '/diagnostic-dashboard/profile',
// //   ];

// //   // ✅ Check if current route is home section
// //   const isPatientHome = patientHomePaths.includes(location.pathname);
// //   const isDoctorHome = doctorHomePaths.includes(location.pathname);
// //   const isDiagnosticHome = diagnosticHomePaths.includes(location.pathname);

// //   return (
// //     <div className="min-h-screen flex flex-col bg-gray-50 scroll-smooth">
// //       {/* ✅ Navbar logic */}
// //       {isPatientRoute && <PatientNavbar />}
// //       {isDoctorRoute && <DoctorNavbar />}
// //       {isDiagnosticRoute && <DiagnosticNavbar />}

// //       <div className={isPatientRoute || isDoctorRoute || isDiagnosticRoute ? 'mt-20' : ''}>
// //         <Routes>
// //           {/* ======================= Patient Routes ======================= */}
// //           {isPatientRoute && (
// //             <>
// //               {isPatientHome && (
// //                 <Route path="/patient-dashboard/*" element={<HomePage />} />
// //               )}
// //               <Route path="/patient-dashboard/patientReg" element={<PatientRegistration />} />
// //               <Route path="/patient-dashboard/userprofile" element={<UserProfile />} />
// //               <Route path="/patient-dashboard/diagnostic-services" element={<DiagnosticServices />} />
// //               <Route path="/patient-dashboard/appointment-services" element={<AppointmentServices />} />
// //               <Route path="/patient-dashboard/ambulance-services" element={<AmbulanceServices />} />
// //               <Route path="/patient-dashboard/*" element={<Navigate to="/patient-dashboard" replace />} />
// //             </>
// //           )}

// //           {/* ======================= Doctor Routes ======================= */}
// //           {isDoctorRoute && (
// //             <>
// //               {isDoctorHome && (
// //                 <Route path="/doctor-dashboard/*" element={<DoctorHomePage />} />
// //               )}
// //               <Route path="/doctor-dashboard/appointment-services" element={<DoctorAppointmentServices />} />
// //               <Route path="/doctor-dashboard/patient-records" element={<DoctorPatientRecordsServices />} />
// //               <Route path="/doctor-dashboard/*" element={<Navigate to="/doctor-dashboard" replace />} />
// //             </>
// //           )}

// //           {/* ======================= Diagnostic Routes ======================= */}
// //           {isDiagnosticRoute && (
// //             <>
// //               {isDiagnosticHome && (
// //                 <Route path="/diagnostic-dashboard/*" element={<DiagnosticHomePage />} />
// //               )}
// //               <Route path="/diagnostic-dashboard/reports-services" element={<DiagnosticReportsServices />} />
// //               <Route path="/diagnostic-dashboard/tests-services" element={<DiagnosticTestsServices />} />
// //               <Route path="/diagnostic-dashboard/*" element={<Navigate to="/diagnostic-dashboard" replace />} />
// //             </>
// //           )}

// //           {/* ======================= Default Route ======================= */}
// //           <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
// //         </Routes>
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useContext } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import CommonDashBoard from './pages/commonDashBoard';
// import HomePage from './Users/Patient/HomePage';
// import DoctorHomePage from './Users/Doctor/DoctorHomePage';
// import DiagnosticHomePage from './Users/Diagnostic/DiagnosticHomePage';
// import Login from './Auth/Login';

// const App = () => {

//   return (
//     <>
//       <Routes>
//         <Route path='/' element={<CommonDashBoard />} />
//         <Route path='/login' element={<Login/>} />
//         <Route path='/patient-dashboard' element={<HomePage />} />
//         <Route path='/doctor-dashboard' element={<DoctorHomePage />} />
//         <Route path='/diagnostic-dashboard' element={<DiagnosticHomePage />} />
//       </Routes>
//     </>
//   );
// };

// export default App;



import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ===================== Patient Components =====================
import PatientNavbar from './Users/Patient/PatientNavbar';
import HomePage from './Users/Patient/HomePage';
import PatientRegistration from './Users/Patient/PatientRegistration';
import UserProfile from './Users/Patient/UserProfile';
import DiagnosticServices from './Users/Patient/Services/DiagnosticServices';
import AmbulanceServices from './Users/Patient/Services/AmbulanceServices';
import AppointmentServices from './Users/Patient/Services/appointmentService';

// ===================== Doctor Components ======================
import DoctorNavbar from './Users/Doctor/DoctorNavbar';
import DoctorHomePage from './Users/Doctor/DoctorHomePage';
import DoctorAppointmentServices from './Users/Doctor/DoctorAppointmentServices';
import DoctorPatientRecordsServices from './Users/Doctor/DoctorPatientRecordsServices';
import DoctorProfile from './Users/Doctor/DoctorProfile';

// ===================== Diagnostic Components ==================
import DiagnosticNavbar from './Users/Diagnostic/DiagnosticNavbar';
import DiagnosticHomePage from './Users/Diagnostic/DiagnosticHomePage';
import DiagnosticReportsServices from './Users/Diagnostic/DiagnosticReportsServices';
import DiagnosticTestsServices from './Users/Diagnostic/DiagnosticTestsServices';
import DiagnosticProfile from './Users/Diagnostic/DiagnosticProfile';

// ===================== Auth Components ========================
import Login from './Auth/Login';
import CommonDashBoard from './pages/commonDashBoard';

const App = () => {
  return (
    <Routes>
      {/* ==================== Common & Auth Routes ==================== */}
      <Route path="/" element={<CommonDashBoard />} />
      <Route path="/login" element={<Login />} />

      {/* ==================== Patient Routes ========================== */}
      <Route
        path="/patient-dashboard/*"
        element={
          <>
            <PatientNavbar />
            <Routes>
              <Route path="" element={<HomePage />} />
              <Route path="patientReg" element={<PatientRegistration />} />
              <Route path="userprofile" element={<UserProfile />} />
              <Route path="diagnostic-services" element={<DiagnosticServices />} />
              <Route path="appointment-services" element={<AppointmentServices />} />
              <Route path="ambulance-services" element={<AmbulanceServices />} />
              <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
            </Routes>
          </>
        }
      />

      {/* ==================== Doctor Routes =========================== */}
      <Route
        path="/doctor-dashboard/*"
        element={
          <>
            <DoctorNavbar />
            <Routes>
              <Route path="" element={<DoctorHomePage />} />
              <Route path="appointment-services" element={<DoctorAppointmentServices />} />
              <Route path="patient-records" element={<DoctorPatientRecordsServices />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="*" element={<Navigate to="/doctor-dashboard" replace />} />
            </Routes>
          </>
        }
      />

      {/* ==================== Diagnostic Routes ======================= */}
      <Route
        path="/diagnostic-dashboard/*"
        element={
          <>
            <DiagnosticNavbar />
            <Routes>
              <Route path="" element={<DiagnosticHomePage />} />
              <Route path="reports-services" element={<DiagnosticReportsServices />} />
              <Route path="tests-services" element={<DiagnosticTestsServices />} />
              <Route path="profile" element={<DiagnosticProfile />} />
              <Route path="*" element={<Navigate to="/diagnostic-dashboard" replace />} />
            </Routes>
          </>
        }
      />

      {/* ==================== Catch All Route ========================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
