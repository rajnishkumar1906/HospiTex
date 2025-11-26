import React, { useContext } from 'react';
import { AppContext } from '../../Auth/AppContext';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, DollarSign, X, User, Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';

const AppointmentHistory = () => {
  const { bookedAppointments, setBookedAppointments } = useContext(AppContext);

  const cancelAppointment = (index) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setBookedAppointments(prev => prev.filter((_, i) => i !== index));
      toast.success("Appointment cancelled successfully");
    }
  };

  if (!bookedAppointments || bookedAppointments.length === 0) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center pt-24 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className='text-4xl font-black text-gray-900 mb-4'>My Appointments</h2>
          <p className='text-gray-600 text-lg mb-8'>You haven't booked any appointments yet.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/patient-dashboard/appointment-services'}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Book Your First Appointment
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-24 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-12'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>
            My <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Appointments</span>
          </h2>
          <p className="text-gray-600 text-lg">Manage and track your scheduled appointments</p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {bookedAppointments.map((appt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100'
            >
              <div className='p-6'>
                <div className='flex gap-6'>
                  {/* Doctor Image */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-20"></div>
                    <img
                      src={appt.doctor.img}
                      alt={appt.doctor.name}
                      className='relative w-24 h-24 object-cover rounded-xl border-4 border-white shadow-lg'
                    />
                  </div>

                  {/* Doctor Details */}
                  <div className='flex-1 min-w-0'>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className='text-xl font-black text-gray-900 mb-1 flex items-center gap-2'>
                          <User className="w-5 h-5 text-blue-600" />
                          {appt.doctor.name}
                        </h3>
                        <p className='text-blue-600 font-bold mb-2 flex items-center gap-2'>
                          <Stethoscope className="w-4 h-4" />
                          {appt.doctor.specialty}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => cancelAppointment(idx)}
                        className='p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors'
                        title="Cancel Appointment"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{appt.doctor.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">{new Date(appt.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-cyan-600" />
                        <span className="font-semibold">{appt.time}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Appointment Fee</span>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                          <span className='text-2xl font-black text-emerald-600'>₹{appt.doctor.appointmentFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistory;
