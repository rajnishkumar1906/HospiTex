import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, Stethoscope, MapPin, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const { api } = useApp();
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [service, setService] = useState('General Consultation');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/doctors');
      if (response.data.success) {
        setDoctors(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    
    try {
      const response = await api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`);
      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots || []);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedTime('');
    setAvailableSlots([]);
    if (selectedDate) {
      fetchAvailableSlots(doctor._id, selectedDate);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    if (selectedDoctor) {
      fetchAvailableSlots(selectedDoctor._id, date);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please select doctor, date and time');
      return;
    }

    setBooking(true);
    
    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        date: selectedDate,
        time: selectedTime,
        service: service,
        notes: notes
      };
      
      const response = await api.post('/appointments/book', appointmentData);
      
      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        setTimeout(() => {
          navigate('/patient/appointments');
        }, 1500);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Book an Appointment</h2>
        <p className="text-gray-500 text-sm mt-1">Schedule a consultation with a doctor</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleBookAppointment} className="space-y-6">
          {/* Select Doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedDoctor?._id === doctor._id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        Dr. {doctor.user?.username || 'Doctor'}
                      </h3>
                      <p className="text-sm text-gray-500">{doctor.specialty || 'General Physician'}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{doctor.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-primary-600">
                        <DollarSign className="w-4 h-4" />
                        <span>₹{doctor.appointmentFee || 500}</span>
                      </div>
                    </div>
                    {selectedDoctor?._id === doctor._id && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            {doctors.length === 0 && (
              <p className="text-gray-500 text-center py-4">No doctors available</p>
            )}
          </div>

          {/* Select Date */}
          {selectedDoctor && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={getMinDate()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Select Time */}
          {selectedDate && availableSlots.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedTime === slot
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && availableSlots.length === 0 && selectedDoctor && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">No available slots for this date. Please select another date.</p>
            </div>
          )}

          {/* Service Type */}
          {selectedDoctor && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="General Consultation">General Consultation</option>
                <option value="Follow-up Visit">Follow-up Visit</option>
                <option value="Specialist Consultation">Specialist Consultation</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          )}

          {/* Notes */}
          {selectedDoctor && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your symptoms or any specific concerns..."
              />
            </div>
          )}

          {/* Book Button */}
          {selectedDoctor && selectedDate && selectedTime && (
            <div className="pt-4">
              <button
                type="submit"
                disabled={booking}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {booking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    Book Appointment - ₹{selectedDoctor?.appointmentFee || 500}
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;