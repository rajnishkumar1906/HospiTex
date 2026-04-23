import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Syringe, 
  Truck, 
  Users,
  Activity,
  ClipboardList,
  UserCircle,
  Shield,
  FlaskConical,
  Video
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const location = useLocation();
  
  const menuItems = {
    Patient: [
      { path: '/patient', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { path: '/patient/appointments', icon: Calendar, label: 'Appointments', exact: false },
      { path: '/patient/diagnostics', icon: FlaskConical, label: 'Diagnostics', exact: false },
      { path: '/patient/consultations', icon: Video, label: 'Consultations', exact: false },
      { path: '/patient/ambulance', icon: Truck, label: 'Ambulance', exact: false },
      { path: '/patient/profile', icon: UserCircle, label: 'Profile', exact: false },
    ],
    Doctor: [
      { path: '/doctor', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { path: '/doctor/appointments', icon: Calendar, label: 'Appointments', exact: false },
      { path: '/doctor/patients', icon: Users, label: 'Patients', exact: false },
      { path: '/doctor/consultations', icon: Video, label: 'Consultations', exact: false },
      { path: '/doctor/profile', icon: UserCircle, label: 'Profile', exact: false },
    ],
    Diagnostic: [
      { path: '/diagnostic', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { path: '/diagnostic/reports', icon: ClipboardList, label: 'Test Reports', exact: false },
      { path: '/diagnostic/bookings', icon: Calendar, label: 'Bookings', exact: false },
      { path: '/diagnostic/profile', icon: UserCircle, label: 'Profile', exact: false },
    ],
    Admin: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { path: '/admin/users', icon: Users, label: 'Users', exact: false },
      { path: '/admin/verifications', icon: Shield, label: 'Verifications', exact: false },
      { path: '/admin/appointments', icon: Calendar, label: 'Appointments', exact: false },
      { path: '/admin/reports', icon: FileText, label: 'Reports', exact: false },
      { path: '/admin/profile', icon: UserCircle, label: 'Profile', exact: false },
    ],
  };

  const items = menuItems[role] || [];

  const isActivePath = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen sticky top-16">
      <nav className="mt-8">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={() =>
              `flex items-center space-x-3 px-6 py-3 mx-2 rounded-lg transition-all duration-200 ${
                isActivePath(item.path, item.exact)
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-primary-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;