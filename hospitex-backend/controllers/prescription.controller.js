import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Prescription, Doctor, Patient, User, Appointment } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';

// ============================================
// DOCTOR PRESCRIPTION FUNCTIONS
// ============================================

export const createPrescription = handleAsync(async (req, res) => {
  const { patientId, appointmentId, medications, diagnosis, notes, followUpDate } = req.body;
  const doctorId = req.userId;
  
  // Check if doctor exists
  const doctor = await Doctor.findOne({ user: doctorId });
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  // Check if patient exists
  const patient = await User.findById(patientId);
  if (!patient) {
    return apiResponse.error(res, 'Patient not found', 404);
  }
  
  // Validate medications
  if (!medications || medications.length === 0) {
    return apiResponse.error(res, 'At least one medication is required', 400);
  }
  
  // Create prescription
  const prescription = await Prescription.create({
    patient: patientId,
    doctor: doctorId,
    appointment: appointmentId || null,
    medications,
    diagnosis: diagnosis || '',
    notes: notes || '',
    followUpDate: followUpDate || null
  });
  
  // Populate doctor and patient info
  await prescription.populate('doctor', 'username');
  await prescription.populate('patient', 'username');
  
  // Create notification for patient
  await createNotification(
    patientId,
    'New Prescription',
    `Dr. ${prescription.doctor?.username} has created a new prescription for you.`,
    'prescription',
    `/patient/prescriptions/${prescription._id}`,
    prescription._id
  );
  
  // If appointment exists, update it
  if (appointmentId) {
    await Appointment.findByIdAndUpdate(appointmentId, { 
      $push: { prescriptions: prescription._id } 
    });
  }
  
  return apiResponse.created(res, prescription, 'Prescription created successfully');
});

export const getDoctorPrescriptions = handleAsync(async (req, res) => {
  const { patientId, page = 1, limit = 10 } = req.query;
  const doctorId = req.userId;
  
  const query = { doctor: doctorId };
  if (patientId) query.patient = patientId;
  
  const prescriptions = await Prescription.find(query)
    .populate('patient', 'username email')
    .populate('appointment', 'date time')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Prescription.countDocuments(query);
  
  return apiResponse.paginated(res, prescriptions, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const updatePrescription = handleAsync(async (req, res) => {
  const { prescriptionId } = req.params;
  const { medications, diagnosis, notes, followUpDate } = req.body;
  const doctorId = req.userId;
  
  const prescription = await Prescription.findOneAndUpdate(
    { _id: prescriptionId, doctor: doctorId },
    { medications, diagnosis, notes, followUpDate },
    { new: true, runValidators: true }
  ).populate('patient', 'username');
  
  if (!prescription) {
    return apiResponse.error(res, 'Prescription not found or unauthorized', 404);
  }
  
  // Notify patient about update
  await createNotification(
    prescription.patient._id,
    'Prescription Updated',
    `Your prescription has been updated by the doctor.`,
    'prescription',
    `/patient/prescriptions/${prescription._id}`,
    prescription._id
  );
  
  return apiResponse.updated(res, prescription, 'Prescription updated successfully');
});

// ============================================
// PATIENT PRESCRIPTION FUNCTIONS
// ============================================

export const getPatientPrescriptions = handleAsync(async (req, res) => {
  const patientId = req.userId;
  const { page = 1, limit = 10 } = req.query;
  
  const prescriptions = await Prescription.find({ patient: patientId })
    .populate('doctor', 'username specialty')
    .populate('appointment', 'date time')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Prescription.countDocuments({ patient: patientId });
  
  return apiResponse.paginated(res, prescriptions, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

// ============================================
// COMMON FUNCTIONS
// ============================================

export const getPrescriptionById = handleAsync(async (req, res) => {
  const { prescriptionId } = req.params;
  const userId = req.userId;
  const userRole = req.userRole;
  
  const prescription = await Prescription.findById(prescriptionId)
    .populate('doctor', 'username specialty')
    .populate('patient', 'username email')
    .populate('appointment', 'date time status');
  
  if (!prescription) {
    return apiResponse.error(res, 'Prescription not found', 404);
  }
  
  // Check authorization - doctor is stored as User ID directly
  const doctorId = prescription.doctor?._id?.toString() || prescription.doctor?.toString();
  const patientId = prescription.patient?._id?.toString() || prescription.patient?.toString();
  
  const isDoctor = doctorId === userId;
  const isPatient = patientId === userId;
  const isAdmin = userRole === 'Admin';
  
  if (!isDoctor && !isPatient && !isAdmin) {
    return apiResponse.error(res, 'Unauthorized to view this prescription', 403);
  }
  
  return apiResponse.success(res, prescription, 'Prescription retrieved successfully');
});

// ============================================
// ADMIN FUNCTIONS
// ============================================

export const getAllPrescriptionsAdmin = handleAsync(async (req, res) => {
  const { page = 1, limit = 10, doctorId, patientId } = req.query;
  
  const query = {};
  if (doctorId) query.doctor = doctorId;
  if (patientId) query.patient = patientId;
  
  const prescriptions = await Prescription.find(query)
    .populate('doctor', 'username')
    .populate('patient', 'username email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Prescription.countDocuments(query);
  
  return apiResponse.paginated(res, prescriptions, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const deletePrescription = handleAsync(async (req, res) => {
  const { prescriptionId } = req.params;
  
  const prescription = await Prescription.findByIdAndDelete(prescriptionId);
  
  if (!prescription) {
    return apiResponse.error(res, 'Prescription not found', 404);
  }
  
  return apiResponse.deleted(res, 'Prescription deleted successfully');
});

// ============================================
// BASIC CRUD FUNCTIONS (for backward compatibility)
// ============================================

export const getAlls = handleAsync(async (req, res) => {
  const prescriptions = await Prescription.find()
    .populate('doctor', 'username')
    .populate('patient', 'username');
  
  return apiResponse.success(res, prescriptions, 'Prescriptions retrieved successfully');
});

export const getById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const prescription = await Prescription.findById(id)
    .populate('doctor', 'username')
    .populate('patient', 'username');
  
  if (!prescription) {
    return apiResponse.error(res, 'Prescription not found', 404);
  }
  
  return apiResponse.success(res, prescription, 'Prescription retrieved successfully');
});

export const create = handleAsync(async (req, res) => {
  const prescription = await Prescription.create(req.body);
  return apiResponse.created(res, prescription, 'Prescription created successfully');
});

export const update = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const prescription = await Prescription.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!prescription) {
    return apiResponse.error(res, 'Prescription not found', 404);
  }
  
  return apiResponse.updated(res, prescription, 'Prescription updated successfully');
});

export const deletePrescriptionById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const prescription = await Prescription.findByIdAndDelete(id);
  
  if (!prescription) {
    return apiResponse.error(res, 'Prescription not found', 404);
  }
  
  return apiResponse.deleted(res, 'Prescription deleted successfully');
});