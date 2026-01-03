import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../Auth/AppContext';
import apiClient from '../../config/axios';
import { motion } from 'framer-motion';
import { Calendar, Users, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Stethoscope, Zap, ArrowRight } from 'lucide-react';

function DoctorHome() {
  const { User, IsLoggedIn } = useContext(AppContext);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalPrescriptions: 0
  });
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    if (IsLoggedIn) {
      fetchStats();
      fetchUpcomingAppointments();
    }
  }, [IsLoggedIn]);

  const fetchStats = async () => {
    try {
      const { data } = await apiClient.get('/api/appointments/doctor/all');
      const appointments = data?.appointments || [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayApps = appointments.filter(app => {
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);
        return appDate.getTime() === today.getTime();
      });

      setStats({
        todayAppointments: todayApps.length,
        totalAppointments: appointments.length,
        confirmedAppointments: appointments.filter(a => a.status === 'Confirmed').length,
        pendingAppointments: appointments.filter(a => a.status === 'Pending').length,
        completedAppointments: appointments.filter(a => a.status === 'Completed').length,
        totalPrescriptions: 0 // Can be fetched separately if needed
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const { data } = await apiClient.get('/api/appointments/doctor/all');
      const appointments = data?.appointments || [];
      
      // Get upcoming appointments (next 3)
      const upcoming = appointments
        .filter(app => {
          const appDate = new Date(app.date);
          return appDate >= new Date() && (app.status === 'Confirmed' || app.status === 'Pending');
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "from-emerald-500 to-green-600",
      link: "/doctor-dashboard/appointment-services"
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      link: "/doctor-dashboard/appointment-services"
    },
    {
      title: "Confirmed",
      value: stats.confirmedAppointments,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      link: "/doctor-dashboard/appointment-services"
    },
    {
      title: "Pending",
      value: stats.pendingAppointments,
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
      link: "/doctor-dashboard/appointment-services"
    },
    {
      title: "Completed",
      value: stats.completedAppointments,
      icon: CheckCircle,
      color: "from-gray-500 to-slate-600",
      link: "/doctor-dashboard/appointment-services"
    },
    {
      title: "Patient Records",
      value: "View All",
      icon: FileText,
      color: "from-purple-500 to-pink-600",
      link: "/doctor-dashboard/patient-records"
    }
  ];

  // Quick Actions (moved from Quick Actions section, now enhanced)
  const quickActions = [
    { title: 'Manage Appointments', path: '/doctor-dashboard/appointment-services', icon: Calendar, desc: 'View and manage all appointments' },
    { title: 'Patient Records', path: '/doctor-dashboard/patient-records', icon: FileText, desc: 'Access patient medical histories' }
  ];

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Welcome back, <span className="text-emerald-600">Dr. {User?.username || 'Doctor'}</span>!
              </h1>
              <p className="text-lg text-gray-600">
                Here's your dashboard overview and today's schedule
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg"
            >
              <Stethoscope className="w-12 h-12 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Link to={card.link}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-2">{card.title}</h3>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                      {card.value}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Upcoming Appointments & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-emerald-600" />
                Upcoming Appointments
              </h2>
              <Link
                to="/doctor-dashboard/appointment-services"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {app.patient?.username || app.patient?.email || 'Patient'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(app.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })} at {app.time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-emerald-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    to={action.path}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:from-emerald-100 hover:to-green-100 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default DoctorHome;
