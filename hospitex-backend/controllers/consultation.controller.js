import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Consultation, Appointment, Doctor, User, Prescription } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

const generateRoomId = () => {
  return `consult_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};

// GET USER CONSULTATIONS
export const getUserConsultations = handleAsync(async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;
  const { status, page = 1, limit = 10 } = req.query;

  let query = {};

  if (userRole === 'Patient') {
    query = { patient: userId };
  } else if (userRole === 'Doctor') {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return apiResponse.error(res, 'Doctor profile not found', 404);
    }
    query = { doctor: doctor._id };
  } else if (userRole === 'Admin') {
    query = {};
  }

  if (status) {
    query.status = status;
  }

  const consultations = await Consultation.find(query)
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Consultation.countDocuments(query);

  return apiResponse.paginated(res, consultations, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  }, 'Consultations retrieved successfully');
});

// GET CONSULTATION BY ID
export const getConsultationById = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const userId = req.userId;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  const consultation = await Consultation.findById(consultationId)
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    })
    .populate('prescription');

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  const isPatient = consultation.patient._id.toString() === userId;
  const isDoctor = consultation.doctor.user._id.toString() === userId;
  const isAdmin = req.userRole === 'Admin';

  if (!isPatient && !isDoctor && !isAdmin) {
    return apiResponse.error(res, 'Unauthorized to view this consultation', 403);
  }

  return apiResponse.success(res, consultation, 'Consultation retrieved successfully');
});

// GET CONSULTATION BY APPOINTMENT
export const getConsultationByAppointment = handleAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.userId;

  if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
    return apiResponse.error(res, 'Invalid appointment ID', 400);
  }

  const consultation = await Consultation.findOne({ appointment: appointmentId })
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    });

  if (!consultation) {
    return apiResponse.success(res, {
      exists: false,
      message: 'No consultation room created yet'
    }, 'Consultation not found');
  }

  const isPatient = consultation.patient._id.toString() === userId;
  const isDoctor = consultation.doctor.user._id.toString() === userId;

  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized', 403);
  }

  return apiResponse.success(res, {
    exists: true,
    consultation: {
      id: consultation._id,
      roomId: consultation.roomId,
      meetingLink: consultation.meetingLink,
      status: consultation.status,
      startedAt: consultation.startedAt,
      endedAt: consultation.endedAt,
      messages: consultation.messages,
      sharedFiles: consultation.sharedFiles
    }
  }, 'Consultation retrieved successfully');
});

// GET MESSAGES
export const getMessages = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const userId = req.userId;
  const { page = 1, limit = 50 } = req.query;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  const consultation = await Consultation.findById(consultationId)
    .populate({
      path: 'messages.prescription',
      model: 'Prescription'
    });

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  const isPatient = consultation.patient.toString() === userId;
  const doctor = await Doctor.findOne({ user: userId });
  const isDoctor = doctor && consultation.doctor.toString() === doctor._id.toString();

  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized', 403);
  }

  const messages = consultation.messages || [];
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginatedMessages = messages.slice(start, end);

  return apiResponse.paginated(res, paginatedMessages.reverse(), {
    page: parseInt(page),
    limit: parseInt(limit),
    total: messages.length,
    pages: Math.ceil(messages.length / limit)
  }, 'Messages retrieved successfully');
});

// SEND MESSAGE
export const sendMessage = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const { message, fileUrl, fileName, fileType } = req.body;
  const userId = req.userId;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  if (!message && !fileUrl) {
    return apiResponse.error(res, 'Message or file is required', 400);
  }

  const consultation = await Consultation.findById(consultationId)
    .populate('patient', 'username')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username' }
    });

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  if (consultation.status === 'ended') {
    return apiResponse.error(res, 'Consultation has ended', 400);
  }

  const isPatient = consultation.patient._id.toString() === userId;
  const isDoctor = consultation.doctor.user._id.toString() === userId;

  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized', 403);
  }

  const senderRole = isDoctor ? 'Doctor' : 'Patient';
  const senderName = isDoctor 
    ? `Dr. ${consultation.doctor.user?.username || 'Doctor'}`
    : consultation.patient.username;

  const newMessage = {
    sender: userId,
    senderRole: senderRole,
    message: message || '',
    fileUrl: fileUrl || '',
    fileName: fileName || '',
    fileType: fileType || '',
    readBy: [userId],
    createdAt: new Date()
  };

  consultation.messages.push(newMessage);
  await consultation.save();

  const io = req.app.get('io');
  if (io) {
    io.to(consultation.roomId).emit('new-message', {
      ...newMessage,
      senderName: senderName
    });
  }

  const otherPartyId = isDoctor ? consultation.patient._id : consultation.doctor.user;
  await createNotification(
    otherPartyId,
    'New Message',
    `${senderName} sent a message in consultation`,
    'appointment',
    isDoctor ? `/patient/consultations/${consultation.roomId}` : `/doctor/consultations/${consultation.roomId}`,
    consultation._id
  );

  return apiResponse.success(res, newMessage, 'Message sent successfully');
});

// ADD PRESCRIPTION (Doctor only)
export const addPrescription = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const { medications, diagnosis, notes, followUpDate } = req.body;
  const userId = req.userId;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  const consultation = await Consultation.findById(consultationId)
    .populate('patient', 'username email')
    .populate('doctor', 'user');

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  const isDoctor = consultation.doctor.user.toString() === userId;

  if (!isDoctor) {
    return apiResponse.error(res, 'Only doctor can add prescription', 403);
  }

  const prescription = await Prescription.create({
    patient: consultation.patient._id,
    doctor: consultation.doctor._id,
    appointment: consultation.appointment,
    medications: medications || [],
    diagnosis: diagnosis || '',
    notes: notes || '',
    followUpDate: followUpDate ? new Date(followUpDate) : null
  });

  consultation.prescription = prescription._id;
  
  // Add a message to the consultation chat about the new prescription
  const prescriptionMessage = {
    sender: userId,
    senderRole: 'Doctor',
    message: `Prescription added for diagnosis: ${diagnosis || 'N/A'}`,
    fileType: 'prescription',
    prescription: prescription._id,
    readBy: [userId],
    createdAt: new Date()
  };
  
  consultation.messages.push(prescriptionMessage);
  await consultation.save();

  // Socket emit if available
  const io = req.app.get('io');
  if (io) {
    io.to(consultation.roomId).emit('new-message', {
      ...prescriptionMessage,
      senderName: `Dr. ${consultation.doctor.user?.username || 'Doctor'}`
    });
  }

  await createNotification(
    consultation.patient._id,
    'Prescription Added 📋',
    `Dr. ${consultation.doctor.user?.username} has added a prescription for you.`,
    'appointment',
    `/patient/consultations`,
    prescription._id
  );

  return apiResponse.success(res, prescription, 'Prescription added successfully');
});

// PROCESS PAYMENT (Patient only)
export const processPayment = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const { amount, paymentMethod, transactionId } = req.body;
  const userId = req.userId;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  const consultation = await Consultation.findById(consultationId)
    .populate('patient', 'username email')
    .populate('doctor', 'user');

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  const isPatient = consultation.patient._id.toString() === userId;

  if (!isPatient) {
    return apiResponse.error(res, 'Only patient can make payment', 403);
  }

  consultation.paymentStatus = 'completed';
  consultation.paymentDetails = {
    amount: amount || 0,
    paymentMethod: paymentMethod || 'online',
    transactionId: transactionId || `TXN_${Date.now()}`,
    paidAt: new Date()
  };
  await consultation.save();

  await createNotification(
    consultation.doctor.user,
    'Payment Received 💰',
    `Payment of ₹${amount} received from ${consultation.patient.username}`,
    'payment',
    `/doctor/consultations`,
    consultation._id
  );

  return apiResponse.success(res, {
    paymentStatus: consultation.paymentStatus,
    paymentDetails: consultation.paymentDetails
  }, 'Payment processed successfully');
});

// COMPLETE CONSULTATION (Doctor only)
export const completeConsultation = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const { notes, prescription } = req.body;
  const userId = req.userId;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  const consultation = await Consultation.findById(consultationId)
    .populate('patient', 'username email')
    .populate('doctor', 'user');

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  const isDoctor = consultation.doctor.user.toString() === userId;

  if (!isDoctor) {
    return apiResponse.error(res, 'Only doctor can complete consultation', 403);
  }

  consultation.status = 'ended';
  consultation.endedAt = new Date();
  if (notes) consultation.notes = notes;
  if (prescription) consultation.prescription = prescription;
  await consultation.save();

  await Appointment.findByIdAndUpdate(consultation.appointment, {
    status: 'Completed'
  });

  await createNotification(
    consultation.patient._id,
    'Consultation Completed ✅',
    `Your consultation with Dr. ${consultation.doctor.user?.username} has been completed.`,
    'appointment',
    `/patient/consultations`,
    consultation._id
  );

  return apiResponse.success(res, consultation, 'Consultation completed successfully');
});

// START CONSULTATION ROOM
export const startConsultation = handleAsync(async (req, res) => {
  const { appointmentId } = req.body;
  const userId = req.userId;

  console.log('startConsultation - appointmentId:', appointmentId);
  console.log('startConsultation - userId:', userId);

  if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
    return apiResponse.error(res, 'Invalid appointment ID', 400);
  }

  const appointment = await Appointment.findById(appointmentId)
    .populate('patient', 'username email')
    .populate('doctor');

  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }

  console.log('Appointment doctor ID:', appointment.doctor?._id);
  console.log('Appointment patient ID:', appointment.patient?._id);

  // Find doctor profile by user ID
  const doctorProfile = await Doctor.findOne({ user: userId }).populate('user', 'username');
  console.log('Doctor profile found:', !!doctorProfile);
  console.log('Doctor profile ID:', doctorProfile?._id);

  // Check if user is the doctor (compare doctor profile ID with appointment.doctor._id)
  const isDoctor = doctorProfile && appointment.doctor && 
                    doctorProfile._id.toString() === appointment.doctor._id.toString();
  const isPatient = appointment.patient && appointment.patient._id.toString() === userId;

  console.log('isDoctor:', isDoctor);
  console.log('isPatient:', isPatient);

  if (!isDoctor && !isPatient) {
    return apiResponse.error(res, 'Unauthorized', 403);
  }

  if (!isDoctor) {
    return apiResponse.error(res, 'Only the doctor can start the consultation', 403);
  }

  if (appointment.status !== 'Confirmed') {
    return apiResponse.error(res, 'Consultation can only be started for confirmed appointments', 400);
  }

  let consultation = await Consultation.findOne({ appointment: appointmentId });

  if (consultation) {
    return apiResponse.success(res, {
      consultation: {
        id: consultation._id,
        roomId: consultation.roomId,
        meetingLink: consultation.meetingLink,
        status: consultation.status
      }
    }, 'Consultation already exists');
  }

  const roomId = generateRoomId();
  const meetingLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/patient/consultations/${roomId}`;

  consultation = await Consultation.create({
    appointment: appointmentId,
    patient: appointment.patient._id,
    doctor: appointment.doctor._id,
    roomId: roomId,
    meetingLink: meetingLink,
    status: 'active',
    scheduledTime: appointment.date,
    startedAt: new Date(),
    createdBy: userId,
    messages: [],
    sharedFiles: []
  });

  await createNotification(
    appointment.patient._id,
    'Consultation Started 🎥',
    `Dr. ${doctorProfile?.user?.username || 'Your doctor'} has started the consultation. Click to join.`,
    'appointment',
    `/patient/consultations/${roomId}`,
    consultation._id
  );

  return apiResponse.created(res, {
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
      time: appointment.time
    }
  }, 'Consultation started successfully');
});

// JOIN CONSULTATION ROOM
export const joinConsultation = handleAsync(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.userId;

  if (!roomId) {
    return apiResponse.error(res, 'Room ID is required', 400);
  }

  const consultation = await Consultation.findOne({ roomId })
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username email' }
    })
    .populate({
      path: 'messages.prescription',
      model: 'Prescription'
    });

  if (!consultation) {
    return apiResponse.error(res, 'Consultation room not found', 404);
  }

  const isPatient = consultation.patient._id.toString() === userId;
  const isDoctor = consultation.doctor.user._id.toString() === userId;

  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized to join this consultation', 403);
  }

  if (consultation.status === 'ended') {
    return apiResponse.error(res, 'This consultation has already ended', 400);
  }

  if (consultation.status === 'scheduled') {
    consultation.status = 'active';
    consultation.startedAt = new Date();
    await consultation.save();
  }

  return apiResponse.success(res, {
    consultation: {
      id: consultation._id,
      roomId: consultation.roomId,
      meetingLink: consultation.meetingLink,
      status: consultation.status,
      startedAt: consultation.startedAt,
      endedAt: consultation.endedAt
    },
    patient: {
      id: consultation.patient._id,
      name: consultation.patient.username,
      email: consultation.patient.email
    },
    doctor: {
      id: consultation.doctor._id,
      name: consultation.doctor.user?.username,
      specialty: consultation.doctor.specialty
    },
    messages: consultation.messages || [],
    sharedFiles: consultation.sharedFiles || [],
    userRole: isDoctor ? 'doctor' : 'patient'
  }, 'Joined consultation successfully');
});

// SHARE FILE IN CONSULTATION
export const shareFile = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const { fileUrl, fileName, fileType } = req.body;
  const userId = req.userId;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  if (!fileUrl) {
    return apiResponse.error(res, 'File URL is required', 400);
  }

  const consultation = await Consultation.findById(consultationId);

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  const isPatient = consultation.patient.toString() === userId;
  const doctor = await Doctor.findOne({ user: userId });
  const isDoctor = doctor && consultation.doctor.toString() === doctor._id.toString();

  if (!isPatient && !isDoctor) {
    return apiResponse.error(res, 'Unauthorized', 403);
  }

  if (consultation.status === 'ended') {
    return apiResponse.error(res, 'Consultation has ended', 400);
  }

  const sharedFile = {
    fileName: fileName || 'file',
    fileUrl: fileUrl,
    fileType: fileType || 'document',
    uploadedBy: userId,
    uploadedAt: new Date()
  };

  consultation.sharedFiles.push(sharedFile);
  await consultation.save();

  const senderRole = isDoctor ? 'Doctor' : 'Patient';
  const newMessage = {
    sender: userId,
    senderRole: senderRole,
    message: `Shared a file: ${fileName}`,
    fileUrl: fileUrl,
    fileName: fileName,
    fileType: fileType,
    readBy: [userId],
    createdAt: new Date()
  };

  consultation.messages.push(newMessage);
  await consultation.save();

  const io = req.app.get('io');
  if (io) {
    io.to(consultation.roomId).emit('new-file', sharedFile);
    io.to(consultation.roomId).emit('new-message', newMessage);
  }

  return apiResponse.success(res, { sharedFile, message: newMessage }, 'File shared successfully');
});

// MARK MESSAGES AS READ
export const markMessagesAsRead = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const userId = req.userId;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  const consultation = await Consultation.findById(consultationId);

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  let updated = false;
  consultation.messages.forEach(message => {
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      updated = true;
    }
  });

  if (updated) {
    await consultation.save();
  }

  return apiResponse.success(res, null, 'Messages marked as read');
});

// END CONSULTATION
export const endConsultation = handleAsync(async (req, res) => {
  const { consultationId } = req.params;
  const { notes } = req.body;
  const userId = req.userId;

  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    return apiResponse.error(res, 'Invalid consultation ID', 400);
  }

  const consultation = await Consultation.findById(consultationId)
    .populate('patient', 'username email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username' }
    });

  if (!consultation) {
    return apiResponse.error(res, 'Consultation not found', 404);
  }

  const isDoctor = consultation.doctor.user._id.toString() === userId;

  if (!isDoctor) {
    return apiResponse.error(res, 'Only the doctor can end the consultation', 403);
  }

  consultation.status = 'ended';
  consultation.endedAt = new Date();
  if (notes) consultation.notes = notes;
  await consultation.save();

  await Appointment.findByIdAndUpdate(consultation.appointment, {
    status: 'Completed'
  });

  await createNotification(
    consultation.patient._id,
    'Consultation Ended 📋',
    `Your consultation with Dr. ${consultation.doctor.user?.username} has ended.`,
    'appointment',
    `/patient/consultations`,
    consultation._id
  );

  const io = req.app.get('io');
  if (io) {
    io.to(consultation.roomId).emit('consultation-ended', { endedAt: consultation.endedAt });
  }

  return apiResponse.success(res, consultation, 'Consultation ended successfully');
});