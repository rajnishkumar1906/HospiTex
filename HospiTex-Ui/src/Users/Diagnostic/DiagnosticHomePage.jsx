import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import DiagnosticHome from "./DiagnosticHome";
import DiagnosticReportsOverview from "./DiagnosticReportsOverview";
import DiagnosticTestsOverview from "./DiagnosticTestsOverview";
import MediBot from "../../Medibot/MediBot";
import DiagnosticNavbar from "../Diagnostic/DiagnosticNavbar";

const DiagnosticHomePage = () => {
  const location = useLocation();

  const homeRef = useRef(null);
  const reportsRef = useRef(null);
  const testsRef = useRef(null);

  useEffect(() => {
    const scrollToRef = (ref) => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    switch (location.pathname) {
      case "/diagnostic-dashboard/":
        scrollToRef(homeRef);
        break;
      case "/diagnostic-dashboard/reports":
        scrollToRef(reportsRef);
        break;
      case "/diagnostic-dashboard/tests":
        scrollToRef(testsRef);
        break;
      default:
        scrollToRef(homeRef);
    }
  }, [location.pathname]);

  return (
    <div>
      <DiagnosticNavbar/>

      <div ref={homeRef}>
        <DiagnosticHome />
      </div>

      <div ref={reportsRef}>
        <DiagnosticReportsOverview />
      </div>

      <div ref={testsRef}>
        <DiagnosticTestsOverview />
      </div>

      <MediBot />
    </div>
  );
};

export default DiagnosticHomePage;
