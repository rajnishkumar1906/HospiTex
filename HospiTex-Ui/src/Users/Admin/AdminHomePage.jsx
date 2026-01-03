import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminHome from "./AdminHome";
import AdminUsersOverview from "./AdminUsersOverview";
import AdminNavbar from "./AdminNavbar";

const AdminHomePage = () => {
  const location = useLocation();
  const homeRef = useRef(null);
  const usersRef = useRef(null);

  useEffect(() => {
    const scrollToRef = (ref) => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    switch (location.pathname) {
      case "/admin-dashboard/":
      case "/admin-dashboard":
        scrollToRef(homeRef);
        break;
      case "/admin-dashboard/users":
        scrollToRef(usersRef);
        break;
      default:
        scrollToRef(homeRef);
    }
  }, [location.pathname]);

  return (
    <div>
      <AdminNavbar />
      <div ref={homeRef}>
        <AdminHome />
      </div>
      <div ref={usersRef}>
        <AdminUsersOverview />
      </div>
    </div>
  );
};

export default AdminHomePage;

