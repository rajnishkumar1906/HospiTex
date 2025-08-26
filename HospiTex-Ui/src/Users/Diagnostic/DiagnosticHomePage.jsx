import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import DiagnosticHome from "./DiagnosticHome";
import DiagnosticReportsOverview from "./DiagnosticReportsOverview";
import DiagnosticTestsOverview from "./DiagnosticTestsOverview";
import DiagnosticContact from "./DiagnosticContact";
import MediBot from "../../Medibot/MediBot";
import DiagnosticNavbar from './DiagnosticNavbar';

const DiagnosticHomePage = () => {
  const location = useLocation();

  const reportsRef = useRef(null);
  const testsRef = useRef(null);
  const contactsRef = useRef(null);

  const scrollToSection = (path) => {
    switch (path) {
      case "/diagnostic-dashboard/reports":
        reportsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "/diagnostic-dashboard/tests":
        testsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "/diagnostic-dashboard/contacts":
        contactsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToSection(location.pathname);
  }, [location.pathname]);

  return (
    <div>
      <DiagnosticNavbar/>
      <DiagnosticHome scrollToSection={scrollToSection} />

      <div ref={reportsRef}>
        <DiagnosticReportsOverview />
      </div>

      <div ref={testsRef}>
        <DiagnosticTestsOverview />
      </div>

      <div ref={contactsRef}>
        <DiagnosticContact />
      </div>

      <MediBot />
    </div>
  );
};

export default DiagnosticHomePage;
