import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DoctorHome from "./DoctorHome";
import DoctorAppointmentsOverview from "./DoctorAppointmentsOverview";
import DoctorPatientRecordsOverview from "./DoctorPatientRecordsOverview";
import MediBot from "../../Medibot/MediBot";
import DoctorNavbar from './DoctorNavbar';

const DoctorHomePage = () => {
  const location = useLocation();
  const appointmentsRef = useRef(null);
  const recordsRef = useRef(null);

  useEffect(() => {
    switch (location.pathname) {
      case "/doctor-dashboard/booked-appointments":
        appointmentsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "/doctor-dashboard/records":
        recordsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      {/* Sidebar */}
      <DoctorNavbar />
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <DoctorHome />
        <div ref={appointmentsRef}>
          <DoctorAppointmentsOverview />
        </div>
        <div ref={recordsRef}>
          <DoctorPatientRecordsOverview />
        </div>
        <MediBot/>
      </div>
    </div>
  );
};

export default DoctorHomePage;
