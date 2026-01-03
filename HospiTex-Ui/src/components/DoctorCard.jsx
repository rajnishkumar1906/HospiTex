import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, DollarSign, Award, MapPin, Loader } from 'lucide-react';
import apiClient from "../config/axios";

const defaultSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const DoctorCard = ({ doctor, goBack, onBooked }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [allSlots, setAllSlots] = useState([]);

  if (!doctor) return null;

  // Initialize slots from doctor availability
  useEffect(() => {
    const initialSlots = doctor.availability?.length ? doctor.availability : defaultSlots;
    setAllSlots(initialSlots);
    if (!selectedDate) {
      setAvailableSlots(initialSlots);
    }
  }, [doctor.availability]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate && doctor.userId) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, doctor.userId]);

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const response = await apiClient.get('/api/appointments/available-slots', {
        params: {
          doctorId: doctor.userId,
          date: selectedDate
        }
      });

      if (response.data.success) {
        setAvailableSlots(response.data.availableSlots);
        setAllSlots(response.data.allSlots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Fallback to all slots if API fails
      const fallbackSlots = doctor.availability?.length ? doctor.availability : defaultSlots;
      setAllSlots(fallbackSlots);
      setAvailableSlots(fallbackSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  const bookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time.");
      return;
    }
    if (!doctor.userId) {
      toast.error("Doctor profile is missing required identifiers. Please try another doctor.");
      return;
    }

    const payload = {
      doctorId: doctor.userId,
      date: selectedDate,
      time: selectedTime,
      service: doctor.specialty || "Consultation",
      notes: "",
      appointmentFee: doctor.appointmentFee || 0,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty || "",
      doctorLocation: doctor.location || "",
      doctorImage: doctor.img || "",
    };

    const submit = async () => {
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        const { data } = await apiClient.post("/api/appointments/book", payload);
        toast.success("Appointment booked successfully!");
        if (onBooked) {
          onBooked(data?.appointment);
        }
        goBack();
      } catch (error) {
        const message = error.response?.data?.message || "Unable to book the appointment right now.";
        setSubmitError(message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    };

    submit();
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
              <span className="text-2xl font-black">₹{doctor.appointmentFee ?? 0}</span>
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
                {selectedDate && loadingSlots && (
                  <Loader className="w-4 h-4 text-emerald-600 animate-spin ml-2" />
                )}
              </label>
              {!selectedDate ? (
                <p className="text-sm text-gray-500 mb-3">Please select a date first to see available time slots</p>
              ) : (
                <>
                  {availableSlots.length === 0 && !loadingSlots ? (
                    <p className="text-sm text-red-600 mb-3">No available slots for this date. Please select another date.</p>
                  ) : (
                    <p className="text-sm text-emerald-600 mb-3">
                      {availableSlots.length} slot{availableSlots.length !== 1 ? 's' : ''} available
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-3">
                    {allSlots.map((slot, idx) => {
                      const isAvailable = availableSlots.includes(slot);
                      const isSelected = selectedTime === slot;
                      
                      return (
                        <motion.button
                          key={idx}
                          whileHover={isAvailable ? { scale: 1.05 } : {}}
                          whileTap={isAvailable ? { scale: 0.95 } : {}}
                          onClick={() => isAvailable && setSelectedTime(slot)}
                          disabled={!isAvailable}
                          className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                              : isAvailable
                              ? "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer"
                              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                          }`}
                          title={!isAvailable ? "This slot is already booked" : "Click to select"}
                        >
                          {slot}
                          {!isAvailable && <span className="block text-xs mt-1">Booked</span>}
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {submitError && (
              <p className="text-sm text-red-600 -mt-2">{submitError}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={bookAppointment}
              disabled={!selectedDate || !selectedTime || isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
