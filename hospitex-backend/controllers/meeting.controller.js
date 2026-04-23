import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Consultation, Appointment, Doctor, User } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Generate unique room ID
const generateRoomId = () => {
  return `meet_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};

// ============================================
// CREATE CONSULTATION ROOM
// ============================================
export const createConsultationRoom = handleAsync(async (req, res) => {
  const { appointmentId } = req.body;
  const userId = req.userId;
  const userRole = req.userRole;

  // Validate appointmentId
  if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
    return apiResponse.error(res, 'Invalid appointment ID', 400);
  }

  // Get appointment details
  const appointment = await Appointment.findById(appointmentId)
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    });

  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }

  // Check authorization (only doctor or admin can create room)
  const isDoctor = appointment.doctor.user._id.toString() === userId;
  const isAdmin = userRole === 'Admin';
  
  if (!isDoctor && !isAdmin) {
    return apiResponse.error(res, 'Only doctors can create consultation rooms', 403);
  }

  // Check if appointment is confirmed
  if (appointment.status !== 'Confirmed') {
    return apiResponse.error(res, 'Consultation room can only be created for confirmed appointments', 400);
  }

  // Check if consultation already exists
  let consultation = await Consultation.findOne({ appointment: appointmentId });
  
  if (consultation) {
    return apiResponse.success(res, {
      consultation,
      meetingLink: consultation.meetingLink,
      roomId: consultation.roomId
    }, 'Consultation room already exists');
  }

  // Create new consultation room
  const roomId = generateRoomId();
  const meetingLink = `${process.env.MEETING_URL || 'https://meet.jit.si'}/${roomId}`;
  
  consultation = await Consultation.create({
    appointment: appointmentId,
    patient: appointment.patient._id,
    doctor: appointment.doctor._id,
    roomId: roomId,
    meetingLink: meetingLink,
    status: 'scheduled',
    scheduledTime: appointment.date,
    createdBy: userId
  });

  // Notify patient about consultation room
  await createNotification(
    appointment.patient._id,
    'Consultation Room Ready 🎥',
    `Dr. ${appointment.doctor.user?.username || 'Your doctor'} has opened the consultation room for your appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}. Click to join.`,
    'appointment',
    `/consultation/${consultation._id}`,
    consultation._id
  );

  return apiResponse.created(res, {
    consultation,
    meetingLink: consultation.meetingLink,
    roomId: consultation.roomId
  }, 'Consultation room created successfully');
});

// ============================================
// JOIN CONSULTATION ROOM
// ============================================
export const joinConsultationRoom = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const userId = req.userId;

  // Validate consultationId
  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  // Get consultation details
  const consultation = await Consultation.findById(consultationId)
    .populate('appointment')
    .populate('patient', 'username email')
    .populate('doctor', 'username email');

  if (!consultation) {
    return apiResponse.error(res, 'Consultation room not found', 404);
  }

  // Check if user is authorized (patient or doctor)
  const isPatient = consultation.patient._id.toString() === userId;
  const isDoctor = consultation.doctor._id.toString() === userId;
  
  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized to join this consultation', 403);
  }

  // Check if consultation is active or scheduled
  if (consultation.status === 'ended') {
    return apiResponse.error(res, 'This consultation has already ended', 400);
  }

  if (consultation.status === 'cancelled') {
    return apiResponse.error(res, 'This consultation has been cancelled', 400);
  }

  // Update status to active if joining for first time
  if (consultation.status === 'scheduled') {
    consultation.status = 'active';
    consultation.startedAt = new Date();
    await consultation.save();
  }

  // Get appointment details
  const appointment = await Appointment.findById(consultation.appointment._id);

  return apiResponse.success(res, {
    consultation: {
      id: consultation._id,
      roomId: consultation.roomId,
      meetingLink: consultation.meetingLink,
      status: consultation.status,
      startedAt: consultation.startedAt
    },
    appointment: {
      id: appointment._id,
      date: appointment.date,
      time: appointment.time,
      service: appointment.service,
      status: appointment.status
    },
    userRole: isPatient ? 'patient' : 'doctor',
    otherParty: {
      name: isPatient ? consultation.doctor.username : consultation.patient.username,
      role: isPatient ? 'doctor' : 'patient'
    }
  }, 'Joined consultation room successfully');
});

// ============================================
// END CONSULTATION
// ============================================
export const endConsultation = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const { notes, prescription } = req.body;
  const userId = req.userId;

  // Validate consultationId
  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  // Get consultation details
  const consultation = await Consultation.findById(consultationId)
    .populate('appointment')
    .populate('patient', 'username email')
    .populate('doctor', 'username email');

  if (!consultation) {
    return apiResponse.error(res, 'Consultation room not found', 404);
  }

  // Check if user is doctor (only doctor can end consultation)
  const isDoctor = consultation.doctor._id.toString() === userId;
  
  if (!isDoctor) {
    return apiResponse.error(res, 'Only the doctor can end the consultation', 403);
  }

  // Update consultation status
  consultation.status = 'ended';
  consultation.endedAt = new Date();
  consultation.notes = notes || consultation.notes;
  await consultation.save();

  // Update appointment status to completed
  if (consultation.appointment) {
    await Appointment.findByIdAndUpdate(consultation.appointment._id, {
      status: 'Completed',
      notes: notes || ''
    });
  }

  // Notify patient that consultation has ended
  await createNotification(
    consultation.patient._id,
    'Consultation Ended 📋',
    `Your consultation with Dr. ${consultation.doctor.username} has ended. A prescription has been shared with you.`,
    'appointment',
    `/patient/prescriptions`,
    consultation._id
  );

  return apiResponse.success(res, {
    consultation,
    message: 'Consultation ended successfully'
  }, 'Consultation ended successfully');
});

// ============================================
// GET CONSULTATION DETAILS
// ============================================
export const getConsultationDetails = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const userId = req.userId;

  // Validate consultationId
  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  // Get consultation details
  const consultation = await Consultation.findById(consultationId)
    .populate('appointment')
    .populate('patient', 'username email')
    .populate('doctor', 'username email');

  if (!consultation) {
    return apiResponse.error(res, 'Consultation room not found', 404);
  }

  // Check authorization (patient or doctor)
  const isPatient = consultation.patient._id.toString() === userId;
  const isDoctor = consultation.doctor._id.toString() === userId;
  
  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized to view this consultation', 403);
  }

  return apiResponse.success(res, consultation, 'Consultation details retrieved successfully');
});

// ============================================
// GET ACTIVE CONSULTATIONS FOR DOCTOR
// ============================================
export const getDoctorActiveConsultations = handleAsync(async (req, res) => {
  const userId = req.userId;

  // Find doctor profile
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }

  // Get active consultations
  const consultations = await Consultation.find({
    doctor: doctor._id,
    status: { $in: ['scheduled', 'active'] }
  })
    .populate('appointment')
    .populate('patient', 'username email')
    .sort({ scheduledTime: 1 });

  return apiResponse.success(res, consultations, 'Active consultations retrieved successfully');
});

// ============================================
// GET PATIENT UPCOMING CONSULTATIONS
// ============================================
export const getPatientUpcomingConsultations = handleAsync(async (req, res) => {
  const userId = req.userId;

  // Get consultations where patient is the user and status is scheduled or active
  const consultations = await Consultation.find({
    patient: userId,
    status: { $in: ['scheduled', 'active'] }
  })
    .populate('appointment')
    .populate('doctor', 'username email')
    .sort({ scheduledTime: 1 });

  return apiResponse.success(res, consultations, 'Upcoming consultations retrieved successfully');
});

// ============================================
// GET CONSULTATION HISTORY
// ============================================
export const getConsultationHistory = handleAsync(async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;
  const { page = 1, limit = 10 } = req.query;

  let query = {};
  
  if (userRole === 'Patient') {
    query = { patient: userId, status: 'ended' };
  } else if (userRole === 'Doctor') {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return apiResponse.error(res, 'Doctor profile not found', 404);
    }
    query = { doctor: doctor._id, status: 'ended' };
  } else if (userRole === 'Admin') {
    query = { status: 'ended' };
  }

  const consultations = await Consultation.find(query)
    .populate('appointment')
    .populate('patient', 'username email')
    .populate('doctor', 'username email')
    .sort({ endedAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Consultation.countDocuments(query);

  return apiResponse.paginated(res, consultations, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  }, 'Consultation history retrieved successfully');
});

// ============================================
// UPDATE CONSULTATION NOTES
// ============================================
export const updateConsultationNotes = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const { notes } = req.body;
  const userId = req.userId;

  // Validate consultationId
  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  // Get consultation details
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    return apiResponse.error(res, 'Consultation room not found', 404);
  }

  // Check if user is doctor
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor || consultation.doctor.toString() !== doctor._id.toString()) {
    return apiResponse.error(res, 'Only the doctor can update consultation notes', 403);
  }

  // Update notes
  consultation.notes = notes;
  await consultation.save();

  return apiResponse.success(res, consultation, 'Consultation notes updated successfully');
});

// ============================================
// GENERATE MEETING TOKEN (for authentication)
// ============================================
export const generateMeetingToken = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const userId = req.userId;

  // Validate consultationId
  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  // Get consultation details
  const consultation = await Consultation.findById(consultationId)
    .populate('patient', 'username')
    .populate('doctor', 'username');

  if (!consultation) {
    return apiResponse.error(res, 'Consultation room not found', 404);
  }

  // Check authorization
  const isPatient = consultation.patient._id.toString() === userId;
  const isDoctor = consultation.doctor._id.toString() === userId;
  
  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized', 403);
  }

  // Generate simple token for meeting authentication
  const user = isPatient ? consultation.patient : consultation.doctor;
  const token = crypto.randomBytes(32).toString('hex');
  
  // Store token temporarily (you can use Redis or in-memory cache)
  // For now, we'll return the meeting link with user info
  
  const meetingLink = `${consultation.meetingLink}?userName=${encodeURIComponent(user.username)}&userRole=${isPatient ? 'patient' : 'doctor'}`;

  return apiResponse.success(res, {
    meetingLink,
    roomId: consultation.roomId,
    userName: user.username,
    userRole: isPatient ? 'patient' : 'doctor'
  }, 'Meeting token generated successfully');
});

// ============================================
// CHECK CONSULTATION STATUS
// ============================================
export const checkConsultationStatus = handleAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.userId;

  // Validate appointmentId
  if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
    return apiResponse.error(res, 'Invalid appointment ID', 400);
  }

  // Find consultation for this appointment
  const consultation = await Consultation.findOne({ appointment: appointmentId });

  if (!consultation) {
    return apiResponse.success(res, {
      exists: false,
      status: null,
      message: 'No consultation room created yet'
    }, 'Consultation not found');
  }

  // Check if user is authorized
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }

  const isPatient = appointment.patient.toString() === userId;
  const isDoctor = appointment.doctor.toString() === userId;

  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized', 403);
  }

  return apiResponse.success(res, {
    exists: true,
    consultation: {
      id: consultation._id,
      status: consultation.status,
      meetingLink: consultation.meetingLink,
      roomId: consultation.roomId,
      startedAt: consultation.startedAt,
      scheduledTime: consultation.scheduledTime
    }
  }, 'Consultation status retrieved successfully');
});