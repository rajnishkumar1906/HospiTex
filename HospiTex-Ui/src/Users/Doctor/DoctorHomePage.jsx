import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DoctorHome from "./DoctorHome";
import DoctorAppointmentsOverview from "./DoctorAppointmentsOverview";
import DoctorPatientRecordsOverview from "./DoctorPatientRecordsOverview";
import DoctorContacts from "./DoctorContacts";
import MediBot from "../../Medibot/MediBot";

const DoctorHomePage = () => {
  const location = useLocation();
  const appointmentsRef = useRef(null);
  const recordsRef = useRef(null);
  const contactsRef = useRef(null);

  useEffect(() => {
    switch (location.pathname) {
      case "/doctor-dashboard/booked-appointments":
        appointmentsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "/doctor-dashboard/records":
        recordsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "/doctor-dashboard/doctor-contacts":
        contactsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div>
      <DoctorHome />
      <div ref={appointmentsRef}>
        <DoctorAppointmentsOverview />
      </div>
      <div ref={recordsRef}>
        <DoctorPatientRecordsOverview />
      </div>
      <div ref={contactsRef}>
        <DoctorContacts />
      </div>
      <MediBot/>
    </div>
  );
};

export default DoctorHomePage;
