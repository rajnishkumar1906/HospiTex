import React, { useState } from "react";
import {toast} from 'react-toastify'

const DoctorCard = ({ doctor, goBack, onBook }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const bookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }
    const appointment = { doctor, date: selectedDate, time: selectedTime };
    onBook(appointment);
    toast.success("Appointment booked");
    
    goBack();
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto mt-10 hover:shadow-2xl transition duration-300">
      <button
        onClick={goBack}
        className="mb-6 text-green-600 font-semibold hover:text-green-800 transition"
      >
        ← Back to Doctors
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Image + Name */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <div className="w-44 h-44 bg-gray-100 border border-green-200 overflow-hidden rounded-lg shadow-sm">
            <img
              src={doctor.img}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="mt-4 text-3xl font-bold text-green-700 text-center md:text-left tracking-wide">
            {doctor.name}
          </h3>
          <p className="text-gray-700 font-medium text-base mt-1 text-center md:text-left">
            {doctor.specialty}
          </p>
        </div>

        {/* Right Side: Info + Booking */}
        <div className="flex-1 flex flex-col gap-5">
          <p className="text-gray-600 font-medium text-sm md:text-base">
            <span className="font-semibold text-gray-800">Experience:</span> {doctor.experience}
          </p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{doctor.about}</p>
          <p className="text-green-800 font-semibold text-lg">
            Appointment Fee: ₹{doctor.appointmentFee}
          </p>
          <p className="text-gray-500 font-medium text-sm">Category: <span className="capitalize">{doctor.category}</span></p>

          {/* Date Picker */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Select Date:</label>
            <input
              type="date"
              className="border p-3 rounded-lg w-full text-gray-700 focus:ring-2 focus:ring-green-300 transition"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Select Time:</label>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTime(slot)}
                  className={`p-3 rounded-lg border font-medium text-sm transition ${
                    selectedTime === slot
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={bookAppointment}
            className="mt-6 w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-800 transition"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
