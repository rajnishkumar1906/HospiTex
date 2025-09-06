import React, { useContext } from 'react';
import { AppContext } from '../../Auth/AppContext';

const AppointmentHistory = () => {
  const { bookedAppointments, setBookedAppointments } = useContext(AppContext);

  const cancelAppointment = (index) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setBookedAppointments(prev => prev.filter((_, i) => i !== index));
    }
  };

  if (!bookedAppointments || bookedAppointments.length === 0) {
    return (
      <div className='min-w-screen min-h-screen flex flex-col justify-between pt-24 px-4 bg-gray-50'>
        <div className='flex flex-col items-center'>
          <h2 className='text-3xl font-bold mb-6'>My Appointments</h2>
          <p className='text-gray-600 text-lg'>You have not booked any appointments yet.</p>
        </div>

        {/* Footer */}
        <footer className="bg-green-800 text-white py-6 mt-12 w-full">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} HospiTex Healthcare. All rights reserved.</p>
            <p className="text-sm md:text-base mt-1">Contact us: info@hospitaltex.com | +91 12345 67890</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className='min-w-screen min-h-screen flex flex-col justify-between pt-24 px-4 bg-gray-50'>
      <div className='flex flex-col items-center'>
        <h2 className='text-3xl font-bold mb-8'>My Appointments</h2>
        <div className='w-full max-w-5xl flex flex-col gap-6'>
          {bookedAppointments.map((appt, idx) => (
            <div
              key={idx}
              className='bg-white rounded-xl shadow-md p-4 flex items-center justify-between gap-4'
              style={{ minHeight: '150px' }}
            >
              {/* Left: Doctor Image */}
              <img
                src={appt.doctor.img}
                alt={appt.doctor.name}
                className='w-[150px] h-[150px] object-cover rounded-lg border border-green-200'
              />

              {/* Middle: Doctor Details */}
              <div className='flex-1 flex flex-col justify-center gap-1' style={{ width: '300px' }}>
                <h3 className='text-xl font-semibold text-green-700'>{appt.doctor.name}</h3>
                <p className='text-gray-600'>{appt.doctor.specialty}</p>
                <p className='text-gray-500 text-sm'>{appt.doctor.location}</p>
                <p className='text-gray-700 mt-1'><span className='font-semibold'>Date:</span> {appt.date}</p>
                <p className='text-gray-700'><span className='font-semibold'>Time:</span> {appt.time}</p>
              </div>

              {/* Right: Fee & Cancel */}
              <div className='flex flex-col items-end justify-center gap-2'>
                <p className='text-green-800 font-semibold text-lg'>₹{appt.doctor.appointmentFee}</p>
                <button
                  onClick={() => cancelAppointment(idx)}
                  className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition'
                >
                  Cancel
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6 mt-12 w-full">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} HospiTex Healthcare. All rights reserved.</p>
          <p className="text-sm md:text-base mt-1">Contact us: info@hospitaltex.com | +91 12345 67890</p>
        </div>
      </footer>
    </div>
  );
};

export default AppointmentHistory;
