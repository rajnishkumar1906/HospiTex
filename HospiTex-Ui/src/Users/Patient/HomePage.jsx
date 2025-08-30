import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import Home from './Home';
import Diagnostic from './Diagnostic';
import Ambulance from './Ambulance';
import Contacts from './Contacts';
import MediBot from '../../Medibot/MediBot';
import BookAppointment from './BookAppointment';
import PatientNavbar from './PatientNavbar'

function HomePage() {
  // These below refs are sticked to each component 
  // Here each Ref's is carrying the component
  const homeRef = useRef(null);
  const appointmentRef = useRef(null);
  const diagnosticRef = useRef(null);
  const ambulanceRef = useRef(null);
  const contactRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    // Component passes to the function will be reached  
    const scrollToRef = (ref) => {
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    switch (location.pathname) {
      case '/patient-dashboard/':
        scrollToRef(homeRef);
        break;
      case '/patient-dashboard/appointment-booking':
        scrollToRef(appointmentRef);
        break;
      case '/patient-dashboard/diagnostic':
        scrollToRef(diagnosticRef);
        break;
      case '/patient-dashboard/ambulance':
        scrollToRef(ambulanceRef);
        break;
      case '/patient-dashboard/contacts':
        scrollToRef(contactRef);
        break;
      default:
        scrollToRef(homeRef);
    }
  }, [location]);

  return (
    <>
      <PatientNavbar/>
      {/* homeRef is sticked to Home component */}
      <div ref={homeRef}>
        <Home />
      </div>

      {/* appointmentRef is sticked to BookAppointment component */}
      <div ref={appointmentRef}>
        <BookAppointment/>
      </div>

      {/* diagnosticRef is sticked to Diagnostic component */}
      <div ref={diagnosticRef}>
        <Diagnostic />
      </div>

      {/* ambulanceRef is sticked to Ambulance  component*/}
      <div ref={ambulanceRef}>
        <Ambulance />
      </div>

      {/* contactRef is sticked to Contat component */}
      <div ref={contactRef}>
        <Contacts />
      </div>

      <MediBot />
    </>
  );
}

export default HomePage;