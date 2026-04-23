import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Appointment, Doctor, User, Patient, Consultation } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';
import { sendAppointmentConfirmation } from '../services/email.service.js';
import mongoose from 'mongoose';

// Generate unique consultation room ID
const generateRoomId = () => {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getAvailableSlots = handleAsync(async (req, res) => {
  const { doctorId, date } = req.query;
  
  console.log('🔍 getAvailableSlots called:', { doctorId, date });
  
  if (!doctorId || !date) {
    return apiResponse.error(res, 'Doctor ID and date are required', 400);
  }
  
  // Try to find doctor by ID first, then by user ID
  let doctor = await Doctor.findById(doctorId).populate('user', 'username email');
  
  if (!doctor) {
    doctor = await Doctor.findOne({ user: doctorId }).populate('user', 'username email');
  }
  
  if (!doctor) {
    return apiResponse.error(res, 'Doctor not found', 404);
  }
  
  // Set default availability if doctor has none
  if (!doctor.availability || doctor.availability.length === 0) {
    doctor.availability = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    await doctor.save();
    console.log('✅ Set default availability for doctor');
  }
  
  console.log('✅ Doctor found:', doctor._id, 'Availability:', doctor.availability);
  
  // Parse date correctly
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  const bookedAppointments = await Appointment.find({
    doctor: doctor._id,
    date: { $gte: startDate, $lte: endDate },
    status: { $nin: ['Cancelled', 'Rejected'] }
  });
  
  console.log('📅 Booked appointments:', bookedAppointments.length);
  
  const bookedTimes = bookedAppointments.map(apt => apt.time);
  const availableSlots = doctor.availability.filter(slot => !bookedTimes.includes(slot));
  
  console.log('✅ Available slots:', availableSlots);
  
  return apiResponse.success(res, {
    doctor: {
      id: doctor._id,
      name: doctor.user?.username,
      specialty: doctor.specialty,
      fee: doctor.appointmentFee,
      location: doctor.location
    },
    availableSlots,
    date
  }, 'Available slots retrieved successfully');
});

export const bookAppointment = handleAsync(async (req, res) => {
  const { doctorId, date, time, service, notes } = req.body;
  const patientId = req.userId;
  
  console.log('📅 bookAppointment called:', { doctorId, date, time, patientId });
  
  // Validate required fields
  if (!doctorId || !date || !time) {
    return apiResponse.error(res, 'Doctor ID, date, and time are required', 400);
  }
  
  // Find doctor by ID or user ID
  let doctor = await Doctor.findById(doctorId).populate('user', 'username email specialty location');
  
  if (!doctor) {
    doctor = await Doctor.findOne({ user: doctorId }).populate('user', 'username email specialty location');
  }
  
  if (!doctor) {
    return apiResponse.error(res, 'Doctor not found', 404);
  }
  
  // Parse date range
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  const existingAppointment = await Appointment.findOne({
    doctor: doctor._id,
    date: { $gte: startDate, $lte: endDate },
    time: time,
    status: { $nin: ['Cancelled', 'Rejected'] }
  });
  
  if (existingAppointment) {
    return apiResponse.error(res, 'This time slot is already booked', 400);
  }
  
  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctor._id,
    date: new Date(date),
    time,
    service: service || 'General Consultation',
    notes: notes || '',
    status: 'Confirmed', // Auto-confirmed for patients
    doctorName: doctor.user?.username,
    doctorSpecialty: doctor.specialty,
    doctorLocation: doctor.location,
    appointmentFee: doctor.appointmentFee
  });
  
  const patient = await User.findById(patientId);
  
  // Create notifications
  await createNotification(
    patientId,
    'Appointment Confirmed',
    `Your appointment with Dr. ${doctor.user?.username} on ${new Date(date).toLocaleDateString()} at ${time} has been confirmed.`,
    'appointment',
    `/patient/appointments`,
    appointment._id
  );
  
  await createNotification(
    doctor.user?._id,
    'New Appointment',
    `New appointment booked with patient ${patient?.username} on ${new Date(date).toLocaleDateString()} at ${time}`,
    'appointment',
    `/doctor/appointments`,
    appointment._id
  );
  
  // Send email confirmation
  if (patient?.email) {
    await sendAppointmentConfirmation(
      patient.email,
      patient.username,
      doctor.user?.username,
      new Date(date).toLocaleDateString(),
      time
    );
  }
  
  return apiResponse.created(res, appointment, 'Appointment booked successfully');
});

export const getPatientAppointments = handleAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const patientId = req.userId;
  
  const query = { patient: patientId };
  if (status) query.status = status;
  
  const appointments = await Appointment.find(query)
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    })
    .sort({ date: -1, time: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Appointment.countDocuments(query);
  
  // Check for consultation rooms for each appointment
  const appointmentsWithConsultation = await Promise.all(appointments.map(async (apt) => {
    const consultation = await Consultation.findOne({ appointment: apt._id });
    return {
      ...apt.toObject(),
      consultation: consultation || null
    };
  }));
  
  return apiResponse.paginated(res, appointmentsWithConsultation, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const getDoctorAppointments = handleAsync(async (req, res) => {
  const { status, date, page = 1, limit = 10 } = req.query;
  
  const doctor = await Doctor.findOne({ user: req.userId });
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  const query = { doctor: doctor._id };
  if (status) query.status = status;
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    query.date = { $gte: startDate, $lte: endDate };
  }
  
  const appointments = await Appointment.find(query)
    .populate('patient', 'username email')
    .sort({ date: 1, time: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Appointment.countDocuments(query);
  
  // Check for consultation rooms for each appointment
  const appointmentsWithConsultation = await Promise.all(appointments.map(async (apt) => {
    const consultation = await Consultation.findOne({ appointment: apt._id });
    return {
      ...apt.toObject(),
      consultation: consultation || null
    };
  }));
  
  return apiResponse.paginated(res, appointmentsWithConsultation, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const updateAppointmentStatus = handleAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const { status, notes } = req.body;
  
  console.log('📝 updateAppointmentStatus called:', { appointmentId, status });
  
  // Validate appointmentId
  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return apiResponse.error(res, 'Invalid appointment ID', 400);
  }
  
  const doctor = await Doctor.findOne({ user: req.userId }).populate('user', 'username');
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  const appointment = await Appointment.findOneAndUpdate(
    { _id: appointmentId, doctor: doctor._id },
    { status, notes: notes || '' },
    { new: true }
  ).populate('patient', 'username email');
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }
  
  let consultation = null;
  
  // If appointment is confirmed, create consultation room automatically
  if (status === 'Confirmed') {
    // Check if consultation already exists
    consultation = await Consultation.findOne({ appointment: appointmentId });
    
    if (!consultation) {
      const roomId = generateRoomId();
      const meetingLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/patient/consultations/${roomId}`;
      
      consultation = await Consultation.create({
        appointment: appointmentId,
        patient: appointment.patient._id,
        doctor: doctor._id,
        roomId: roomId,
        meetingLink: meetingLink,
        status: 'active', // Changed to active so patient can join immediately
        scheduledTime: appointment.date,
        startedAt: new Date(),
        createdBy: req.userId
      });
      
      console.log('✅ Consultation room created:', { roomId, meetingLink });
    }
    
    // Notify patient with consultation link
    await createNotification(
      appointment.patient._id,
      'Consultation Room Ready 🎥',
      `Your consultation room is now open. Click to join and start your consultation with Dr. ${doctor.user?.username}.`,
      'appointment',
      `/patient/consultations/${consultation.roomId}`,
      consultation._id
    );
  }
  
  // If appointment is completed, update consultation status
  if (status === 'Completed' && consultation) {
    consultation.status = 'ended';
    consultation.endedAt = new Date();
    await consultation.save();
  }
  
    // Notify patient about status change
  await createNotification(
    appointment.patient._id,
    `Appointment ${status}`,
    `Your appointment with Dr. ${doctor.user?.username} on ${new Date(appointment.date).toLocaleDateString()} has been ${status.toLowerCase()}.`,
    'appointment',
    `/patient/appointments`,
    appointment._id
  );
  
  return apiResponse.success(res, { appointment, consultation }, `Appointment ${status} successfully`);
});

export const cancelAppointment = handleAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.userId;
  const userRole = req.userRole;
  
  console.log('❌ cancelAppointment called:', { appointmentId, userId, userRole });
  
  // Validate appointmentId
  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return apiResponse.error(res, 'Invalid appointment ID', 400);
  }
  
  let appointment;
  
  if (userRole === 'Patient') {
    appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, patient: userId, status: { $nin: ['Cancelled', 'Completed'] } },
      { status: 'Cancelled' },
      { new: true }
    ).populate('doctor', 'user doctorName');
  } else if (userRole === 'Doctor') {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return apiResponse.error(res, 'Doctor profile not found', 404);
    }
    appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctor: doctor._id, status: { $nin: ['Cancelled', 'Completed'] } },
      { status: 'Cancelled' },
      { new: true }
    ).populate('patient', 'username email');
  } else {
    // Admin can cancel any appointment
    appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'Cancelled' },
      { new: true }
    ).populate('patient', 'username email').populate('doctor', 'user doctorName');
  }
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found or cannot be cancelled', 404);
  }
  
  // Delete or update consultation if exists
  const consultation = await Consultation.findOne({ appointment: appointmentId });
  if (consultation) {
    consultation.status = 'cancelled';
    await consultation.save();
  }
  
  // Create notification for the other party
  if (userRole === 'Patient') {
    const doctorUser = await User.findById(appointment.doctor);
    if (doctorUser) {
      await createNotification(
        doctorUser._id,
        'Appointment Cancelled ❌',
        `Patient cancelled appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
        'warning',
        `/doctor/appointments`,
        appointment._id
      );
    }
  } else if (userRole === 'Doctor') {
    await createNotification(
      appointment.patient._id,
      'Appointment Cancelled ❌',
      `Dr. ${appointment.doctorName || 'Your doctor'} cancelled your appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
      'warning',
      `/patient/appointments`,
      appointment._id
    );
  }
  
  return apiResponse.success(res, appointment, 'Appointment cancelled successfully');
});

export const getAppointmentById = handleAsync(async (req, res) => {
  const { appointmentId } = req.params;
  
  // Validate appointmentId
  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return apiResponse.error(res, 'Invalid appointment ID', 400);
  }
  
  const appointment = await Appointment.findById(appointmentId)
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    });
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }
  
  // Get consultation if exists
  const consultation = await Consultation.findOne({ appointment: appointmentId });
  
  return apiResponse.success(res, { ...appointment.toObject(), consultation }, 'Appointment retrieved successfully');
});

export const getConsultationRoom = handleAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.userId;
  
  // Validate appointmentId
  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return apiResponse.error(res, 'Invalid appointment ID', 400);
  }
  
  const appointment = await Appointment.findById(appointmentId)
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    });
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }
  
  // Check if user is authorized (patient or doctor)
  const isPatient = appointment.patient._id.toString() === userId;
  const isDoctor = appointment.doctor._id.toString() === userId;
  
  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized to access consultation', 403);
  }
  
  // Check if appointment is confirmed
  if (appointment.status !== 'Confirmed') {
    return apiResponse.error(res, 'Consultation is only available for confirmed appointments', 400);
  }
  
  // Get or create consultation
  let consultation = await Consultation.findOne({ appointment: appointmentId });
  
  if (!consultation) {
    const roomId = generateRoomId();
    const meetingLink = `${process.env.MEETING_URL || 'https://meet.jit.si'}/${roomId}`;
    
    consultation = await Consultation.create({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      roomId: roomId,
      meetingLink: meetingLink,
      status: 'active',
      scheduledTime: appointment.date,
      startedAt: new Date()
    });
  }
  
  return apiResponse.success(res, {
    consultation,
    appointment,
    userRole: isPatient ? 'patient' : 'doctor',
    meetingLink: consultation.meetingLink
  }, 'Consultation room ready');
});

export const updateDoctorAvailability = handleAsync(async (req, res) => {
  const { availability } = req.body;
  
  if (!availability || !Array.isArray(availability)) {
    return apiResponse.error(res, 'Availability must be an array of time slots', 400);
  }
  
  const doctor = await Doctor.findOneAndUpdate(
    { user: req.userId },
    { availability },
    { new: true, upsert: true }
  );
  
  return apiResponse.success(res, doctor.availability, 'Availability updated successfully');
});

export const getDoctorSchedule = handleAsync(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.userId }).populate('user', 'username');
  
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAppointments = await Appointment.find({
    doctor: doctor._id,
    date: { $gte: today },
    status: { $ne: 'Cancelled' }
  }).sort({ date: 1, time: 1 });
  
  return apiResponse.success(res, {
    doctor: {
      id: doctor._id,
      name: doctor.user?.username,
      specialty: doctor.specialty
    },
    availability: doctor.availability,
    upcomingAppointments
  }, 'Schedule retrieved successfully');
});

// Admin functions
export const getAllAppointmentsAdmin = handleAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  
  const appointments = await Appointment.find(query)
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Appointment.countDocuments(query);
  
  return apiResponse.paginated(res, appointments, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const getAppointmentByIdAdmin = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const appointment = await Appointment.findById(id)
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    });
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }
  
  return apiResponse.success(res, appointment, 'Appointment retrieved successfully');
});

export const createAppointment = handleAsync(async (req, res) => {
  const appointment = await Appointment.create(req.body);
  return apiResponse.created(res, appointment, 'Appointment created successfully');
});

export const updateAppointment = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }
  
  return apiResponse.updated(res, appointment, 'Appointment updated successfully');
});

export const deleteAppointmentById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const appointment = await Appointment.findByIdAndDelete(id);
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }
  
  return apiResponse.deleted(res, 'Appointment deleted successfully');
});