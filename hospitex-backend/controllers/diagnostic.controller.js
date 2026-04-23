import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { DiagnosticReport, Diagnostic, User, Patient, Doctor } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';

// ============================================
// PATIENT DIAGNOSTIC FUNCTIONS
// ============================================

export const bookDiagnosticTest = handleAsync(async (req, res) => {
  const { diagnosticId, testName, testType, testDate, notes } = req.body;
  const patientId = req.userId;
  
  // Check if diagnostic center exists
  const diagnostic = await Diagnostic.findOne({ user: diagnosticId }).populate('user', 'username');
  if (!diagnostic) {
    return apiResponse.error(res, 'Diagnostic center not found', 404);
  }
  
  // Check if patient exists
  const patient = await User.findById(patientId);
  if (!patient) {
    return apiResponse.error(res, 'Patient not found', 404);
  }
  
  // Create diagnostic report
  const report = await DiagnosticReport.create({
    patient: patientId,
    diagnostic: diagnosticId,
    testName,
    testType,
    testDate: new Date(testDate),
    notes: notes || '',
    status: 'Pending'
  });
  
  // Add to patient's diagnostic reports
  await Patient.findOneAndUpdate(
    { user: patientId },
    { $push: { diagnosticReports: report._id } }
  );
  
  // Add to diagnostic center's reports
  await Diagnostic.findOneAndUpdate(
    { user: diagnosticId },
    { $push: { diagnosticReports: report._id } }
  );
  
  // Create notification for diagnostic center
  await createNotification(
    diagnosticId,
    'New Diagnostic Test Booked',
    `Patient ${patient.username} has booked a ${testName} test.`,
    'report',
    `/diagnostic/reports/${report._id}`,
    report._id
  );
  
  // Create notification for patient
  await createNotification(
    patientId,
    'Diagnostic Test Booked',
    `Your ${testName} test has been booked at ${diagnostic.user?.username}.`,
    'report',
    `/patient/diagnostics/${report._id}`,
    report._id
  );
  
  return apiResponse.created(res, report, 'Diagnostic test booked successfully');
});

export const getPatientReports = handleAsync(async (req, res) => {
  const patientId = req.userId;
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = { patient: patientId };
  if (status) query.status = status;
  
  const reports = await DiagnosticReport.find(query)
    .populate('diagnostic', 'centerName address contactNumber')
    .populate({
      path: 'diagnostic',
      populate: { path: 'user', select: 'username email' }
    })
    .sort({ testDate: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await DiagnosticReport.countDocuments(query);
  
  return apiResponse.paginated(res, reports, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

// ============================================
// DOCTOR DIAGNOSTIC FUNCTIONS
// ============================================

export const doctorRequestDiagnosticTest = handleAsync(async (req, res) => {
  const { patientId, diagnosticId, testName, testType, testDate, notes } = req.body;
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
  
  // Check if diagnostic center exists
  const diagnostic = await Diagnostic.findOne({ user: diagnosticId });
  if (!diagnostic) {
    return apiResponse.error(res, 'Diagnostic center not found', 404);
  }
  
  // Create diagnostic report
  const report = await DiagnosticReport.create({
    patient: patientId,
    diagnostic: diagnosticId,
    doctor: doctorId,
    testName,
    testType,
    testDate: new Date(testDate),
    notes: notes || '',
    status: 'Pending'
  });
  
  // Create notifications
  await createNotification(
    patientId,
    'Diagnostic Test Recommended',
    `Dr. ${doctor.user?.username} has recommended a ${testName} test. Please book it.`,
    'report',
    `/patient/diagnostics/${report._id}`,
    report._id
  );
  
  await createNotification(
    diagnosticId,
    'New Diagnostic Test Request',
    `Dr. ${doctor.user?.username} has requested a ${testName} test for patient ${patient.username}.`,
    'report',
    `/diagnostic/reports/${report._id}`,
    report._id
  );
  
  return apiResponse.created(res, report, 'Diagnostic test requested successfully');
});

// ============================================
// DIAGNOSTIC CENTER FUNCTIONS
// ============================================

export const getDiagnosticReports = handleAsync(async (req, res) => {
  const diagnosticId = req.userId;
  const { status, patientId, page = 1, limit = 10 } = req.query;
  
  const query = { diagnostic: diagnosticId };
  if (status) query.status = status;
  if (patientId) query.patient = patientId;
  
  const reports = await DiagnosticReport.find(query)
    .populate('patient', 'username email')
    .populate('doctor', 'username specialty')
    .sort({ testDate: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await DiagnosticReport.countDocuments(query);
  
  return apiResponse.paginated(res, reports, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const updateDiagnosticReport = handleAsync(async (req, res) => {
  const { reportId } = req.params;
  const { results, reportFile, status, notes } = req.body;
  const diagnosticId = req.userId;
  
  const report = await DiagnosticReport.findOneAndUpdate(
    { _id: reportId, diagnostic: diagnosticId },
    { results, reportFile, status, notes },
    { new: true, runValidators: true }
  ).populate('patient', 'username email');
  
  if (!report) {
    return apiResponse.error(res, 'Report not found or unauthorized', 404);
  }
  
  // Notify patient when report is completed
  if (status === 'Completed') {
    await createNotification(
      report.patient._id,
      'Diagnostic Report Ready',
      `Your ${report.testName} report is now available.`,
      'success',
      `/patient/diagnostics/${report._id}`,
      report._id
    );
  }
  
  return apiResponse.updated(res, report, 'Diagnostic report updated successfully');
});

// ============================================
// COMMON FUNCTIONS
// ============================================

export const getReportById = handleAsync(async (req, res) => {
  const { reportId } = req.params;
  const userId = req.userId;
  const userRole = req.userRole;
  
  const report = await DiagnosticReport.findById(reportId)
    .populate('patient', 'username email')
    .populate('diagnostic', 'centerName address contactNumber')
    .populate({
      path: 'diagnostic',
      populate: { path: 'user', select: 'username email' }
    })
    .populate('doctor', 'username specialty');
  
  if (!report) {
    return apiResponse.error(res, 'Report not found', 404);
  }
  
  // Check authorization
  const isPatient = report.patient._id.toString() === userId;
  const isDiagnostic = report.diagnostic._id.toString() === userId;
  const isDoctor = report.doctor && report.doctor._id.toString() === userId;
  const isAdmin = userRole === 'Admin';
  
  if (!isPatient && !isDiagnostic && !isDoctor && !isAdmin) {
    return apiResponse.error(res, 'Unauthorized to view this report', 403);
  }
  
  return apiResponse.success(res, report, 'Report retrieved successfully');
});

// ============================================
// ADMIN FUNCTIONS
// ============================================

export const getAllDiagnosticReports = handleAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  
  const reports = await DiagnosticReport.find(query)
    .populate('patient', 'username email')
    .populate('diagnostic', 'centerName')
    .populate('doctor', 'username')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await DiagnosticReport.countDocuments(query);
  
  return apiResponse.paginated(res, reports, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const deleteDiagnosticReport = handleAsync(async (req, res) => {
  const { reportId } = req.params;
  
  const report = await DiagnosticReport.findByIdAndDelete(reportId);
  
  if (!report) {
    return apiResponse.error(res, 'Report not found', 404);
  }
  
  return apiResponse.deleted(res, 'Diagnostic report deleted successfully');
});

// ============================================
// BASIC CRUD FUNCTIONS (for backward compatibility)
// ============================================

export const getAlls = handleAsync(async (req, res) => {
  const reports = await DiagnosticReport.find()
    .populate('patient', 'username')
    .populate('diagnostic', 'centerName');
  
  return apiResponse.success(res, reports, 'Reports retrieved successfully');
});

export const getById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const report = await DiagnosticReport.findById(id)
    .populate('patient', 'username')
    .populate('diagnostic', 'centerName');
  
  if (!report) {
    return apiResponse.error(res, 'Report not found', 404);
  }
  
  return apiResponse.success(res, report, 'Report retrieved successfully');
});

export const create = handleAsync(async (req, res) => {
  const report = await DiagnosticReport.create(req.body);
  return apiResponse.created(res, report, 'Report created successfully');
});

export const update = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const report = await DiagnosticReport.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!report) {
    return apiResponse.error(res, 'Report not found', 404);
  }
  
  return apiResponse.updated(res, report, 'Report updated successfully');
});

export const deleteReport = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const report = await DiagnosticReport.findByIdAndDelete(id);
  
  if (!report) {
    return apiResponse.error(res, 'Report not found', 404);
  }
  
  return apiResponse.deleted(res, 'Report deleted successfully');
});