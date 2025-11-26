import React, { useState } from "react";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, DollarSign, Award, MapPin } from 'lucide-react';

const DoctorCard = ({ doctor, goBack, onBook }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const bookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time.");
      return;
    }
    const appointment = { doctor, date: selectedDate, time: selectedTime };
    onBook(appointment);
    toast.success("Appointment booked successfully!");
    
    goBack();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto mt-10 border border-gray-100"
    >
      <motion.button
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={goBack}
        className="mb-6 flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Doctors
      </motion.button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Image + Name */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative mb-4"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative w-48 h-48 bg-gradient-to-br from-emerald-50 to-teal-50 border-4 border-white overflow-hidden rounded-2xl shadow-xl">
              <img
                src={doctor.img}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          <div className="text-center lg:text-left">
            <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
              {doctor.name}
            </h3>
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <p className="text-emerald-600 font-bold text-lg">
                {doctor.specialty}
              </p>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <p className="text-sm">{doctor.location}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Info + Booking */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Doctor Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-semibold text-gray-900">{doctor.experience}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">Appointment Fee</span>
              </div>
              <span className="text-2xl font-black">₹{doctor.appointmentFee}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                {doctor.category}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-6">
            {/* Date Picker */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Select Date
              </label>
              <input
                type="date"
                min={today}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                <Clock className="w-5 h-5 text-emerald-600" />
                Select Time
              </label>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTime(slot)}
                    className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                      selectedTime === slot
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                        : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                    }`}
                  >
                    {slot}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={bookAppointment}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
