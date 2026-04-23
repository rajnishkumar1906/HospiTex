import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Ambulance, User, Patient } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';

// ============================================
// PATIENT AMBULANCE FUNCTIONS
// ============================================

export const requestAmbulance = handleAsync(async (req, res) => {
  const { pickupLocation, destination, emergencyType, patientName, contactNumber, notes } = req.body;
  const patientId = req.userId;
  
  // Check if patient exists
  const patient = await User.findById(patientId);
  if (!patient) {
    return apiResponse.error(res, 'Patient not found', 404);
  }
  
  // Create ambulance request
  const ambulance = await Ambulance.create({
    patient: patientId,
    pickupLocation,
    destination,
    emergencyType,
    patientName: patientName || patient.username,
    contactNumber,
    notes: notes || '',
    status: 'Pending'
  });
  
  // Create notification for patient
  await createNotification(
    patientId,
    'Ambulance Requested',
    `Your ambulance request has been submitted. Tracking ID: ${ambulance._id}`,
    'info',
    `/patient/ambulance/${ambulance._id}`,
    ambulance._id
  );
  
  // Create notification for admin (can be expanded to notify all admins)
  const admins = await User.find({ role: 'Admin' });
  for (const admin of admins) {
    await createNotification(
      admin._id,
      'New Ambulance Request',
      `Ambulance requested by ${patient.username} from ${pickupLocation}`,
      'warning',
      `/admin/ambulance/${ambulance._id}`,
      ambulance._id
    );
  }
  
  return apiResponse.created(res, ambulance, 'Ambulance requested successfully');
});

export const getPatientAmbulanceRequests = handleAsync(async (req, res) => {
  const patientId = req.userId;
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = { patient: patientId };
  if (status) query.status = status;
  
  const requests = await Ambulance.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Ambulance.countDocuments(query);
  
  return apiResponse.paginated(res, requests, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const cancelAmbulanceRequest = handleAsync(async (req, res) => {
  const { requestId } = req.params;
  const patientId = req.userId;
  
  const ambulance = await Ambulance.findOneAndUpdate(
    { _id: requestId, patient: patientId, status: { $in: ['Pending', 'Dispatched'] } },
    { status: 'Cancelled' },
    { new: true }
  );
  
  if (!ambulance) {
    return apiResponse.error(res, 'Ambulance request not found or cannot be cancelled', 404);
  }
  
  // Create notification
  await createNotification(
    patientId,
    'Ambulance Request Cancelled',
    `Your ambulance request has been cancelled.`,
    'warning',
    `/patient/ambulance/${ambulance._id}`,
    ambulance._id
  );
  
  return apiResponse.success(res, ambulance, 'Ambulance request cancelled successfully');
});

// ============================================
// ADMIN AMBULANCE FUNCTIONS
// ============================================

export const getAllAmbulanceRequests = handleAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  
  const requests = await Ambulance.find(query)
    .populate('patient', 'username email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Ambulance.countDocuments(query);
  
  return apiResponse.paginated(res, requests, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const updateAmbulanceStatus = handleAsync(async (req, res) => {
  const { requestId } = req.params;
  const { status, estimatedTime, notes } = req.body;
  
  const ambulance = await Ambulance.findByIdAndUpdate(
    requestId,
    { status, estimatedTime, notes },
    { new: true, runValidators: true }
  ).populate('patient', 'username email');
  
  if (!ambulance) {
    return apiResponse.error(res, 'Ambulance request not found', 404);
  }
  
  // Create notification for patient about status update
  let notificationMessage = '';
  switch (status) {
    case 'Dispatched':
      notificationMessage = `Ambulance has been dispatched to ${ambulance.pickupLocation}. Estimated time: ${estimatedTime || 'ASAP'}`;
      break;
    case 'In Transit':
      notificationMessage = `Ambulance is en route to ${ambulance.destination}`;
      break;
    case 'Completed':
      notificationMessage = `Ambulance service completed successfully.`;
      break;
    default:
      notificationMessage = `Ambulance request status updated to ${status}`;
  }
  
  await createNotification(
    ambulance.patient._id,
    `Ambulance ${status}`,
    notificationMessage,
    status === 'Completed' ? 'success' : 'info',
    `/patient/ambulance/${ambulance._id}`,
    ambulance._id
  );
  
  return apiResponse.success(res, ambulance, 'Ambulance status updated successfully');
});

// ============================================
// COMMON FUNCTIONS
// ============================================

export const getAmbulanceRequestById = handleAsync(async (req, res) => {
  const { requestId } = req.params;
  const userId = req.userId;
  const userRole = req.userRole;
  
  const ambulance = await Ambulance.findById(requestId)
    .populate('patient', 'username email');
  
  if (!ambulance) {
    return apiResponse.error(res, 'Ambulance request not found', 404);
  }
  
  // Check authorization
  const isPatient = ambulance.patient._id.toString() === userId;
  const isAdmin = userRole === 'Admin';
  
  if (!isPatient && !isAdmin) {
    return apiResponse.error(res, 'Unauthorized to view this request', 403);
  }
  
  return apiResponse.success(res, ambulance, 'Ambulance request retrieved successfully');
});

// ============================================
// BASIC CRUD FUNCTIONS (for backward compatibility)
// ============================================

export const getAlls = handleAsync(async (req, res) => {
  const ambulances = await Ambulance.find().populate('patient', 'username');
  return apiResponse.success(res, ambulances, 'Ambulance records retrieved successfully');
});

export const getById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const ambulance = await Ambulance.findById(id).populate('patient', 'username');
  
  if (!ambulance) {
    return apiResponse.error(res, 'Ambulance record not found', 404);
  }
  
  return apiResponse.success(res, ambulance, 'Ambulance record retrieved successfully');
});

export const create = handleAsync(async (req, res) => {
  const ambulance = await Ambulance.create(req.body);
  return apiResponse.created(res, ambulance, 'Ambulance record created successfully');
});

export const update = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const ambulance = await Ambulance.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!ambulance) {
    return apiResponse.error(res, 'Ambulance record not found', 404);
  }
  
  return apiResponse.updated(res, ambulance, 'Ambulance record updated successfully');
});

export const deleteAmbulance = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const ambulance = await Ambulance.findByIdAndDelete(id);
  
  if (!ambulance) {
    return apiResponse.error(res, 'Ambulance record not found', 404);
  }
  
  return apiResponse.deleted(res, 'Ambulance record deleted successfully');
});