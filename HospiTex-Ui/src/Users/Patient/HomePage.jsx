import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import Home from './Home';
import Diagnostic from './Diagnostic';
import Ambulance from './Ambulance';
import Contacts from './Contacts';
import MediBot from '../../Medibot/MediBot';
import BookAppointment from './BookAppointment';

function HomePage() {
  const homeRef = useRef(null);
  const appointmentRef = useRef(null);
  const diagnosticRef = useRef(null);
  const ambulanceRef = useRef(null);
  const contactRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
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
      <div ref={homeRef}>
        <Home />
      </div>

      <div ref={appointmentRef}>
        <BookAppointment/>
      </div>

      <div ref={diagnosticRef}>
        <Diagnostic />
      </div>

      <div ref={ambulanceRef}>
        <Ambulance />
      </div>

      <div ref={contactRef}>
        <Contacts />
      </div>

      <MediBot />
    </>
  );
}

export default HomePage;