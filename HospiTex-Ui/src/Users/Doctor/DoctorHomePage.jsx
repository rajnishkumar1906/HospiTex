import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import DoctorHome from './DoctorHome';
import AppointmentManagement from './AppointmentManagement';
import PatientRecords from './PatientRecords';
import DoctorProfile from './DoctorProfile';
import MediBot from '../../Medibot/MediBot';

function DoctorHomePage() {
  const homeRef = useRef(null);
  const appointmentsRef = useRef(null);
  const patientRecordsRef = useRef(null);
  const profileRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    const scrollToRef = (ref) => {
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    switch (location.pathname) {
      case '/doctor-dashboard':
      case '/doctor-dashboard/':
        scrollToRef(homeRef);
        break;
      case '/doctor-dashboard/appointments':
        scrollToRef(appointmentsRef);
        break;
      case '/doctor-dashboard/patient-records':
        scrollToRef(patientRecordsRef);
        break;
      case '/doctor-dashboard/profile':
        scrollToRef(profileRef);
        break;
      default:
        scrollToRef(homeRef);
    }
  }, [location]);

  return (
    <>
      <div ref={homeRef}>
        <DoctorHome />
      </div>

      <div ref={appointmentsRef}>
        <AppointmentManagement />
      </div>

      <div ref={patientRecordsRef}>
        <PatientRecords />
      </div>

      <div ref={profileRef}>
        <DoctorProfile />
      </div>

      <MediBot />
    </>
  );
}

export default DoctorHomePage;
