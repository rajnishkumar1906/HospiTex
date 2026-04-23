import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { User, Patient, Doctor, Diagnostic, Admin, Appointment, Prescription, DiagnosticReport, Ambulance } from '../models/index.js';
import { sendVerificationStatusEmail } from '../services/email.service.js';
import { createNotification } from '../services/notification.service.js';

// ============================================
// DASHBOARD STATISTICS
// ============================================

export const getDashboardStats = handleAsync(async (req, res) => {
  const user = await User.findById(req.userId);
  let query = {};
  
  if (user.role === 'Admin') {
    const admin = await Admin.findOne({ user: user._id });
    if (admin && admin.adminLevel === 'District') {
      query = { district: admin.district, state: admin.state };
    } else if (admin && admin.adminLevel === 'State') {
      query = { state: admin.state };
    }
  }

  const totalUsers = await User.countDocuments(query);
  const totalPatients = await Patient.countDocuments(query);
  const totalDoctors = await Doctor.countDocuments(query);
  const totalDiagnostics = await Diagnostic.countDocuments(query);
  const totalAppointments = await Appointment.countDocuments();
  const pendingVerifications = await User.countDocuments({ 
    ...query, 
    isAccountVerified: false, 
    role: { $in: ['Doctor', 'Diagnostic'] } 
  });
  
  const recentAppointments = await Appointment.find()
    .populate('patient', 'username')
    .populate('doctor', 'user')
    .sort({ createdAt: -1 })
    .limit(5);
  
  const recentUsers = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(5);

  return apiResponse.success(res, {
    totalUsers,
    totalPatients,
    totalDoctors,
    totalDiagnostics,
    totalAppointments,
    pendingVerifications,
    recentAppointments,
    recentUsers
  }, 'Dashboard stats retrieved');
});

// ============================================
// USER MANAGEMENT
// ============================================

export const getAllUsers = handleAsync(async (req, res) => {
  const { role, state, district, isVerified, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (role) query.role = role;
  if (state) query.state = state;
  if (district) query.district = district;
  if (isVerified !== undefined) query.isAccountVerified = isVerified === 'true';

  const users = await User.find(query)
    .select('-password')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  return apiResponse.paginated(res, users, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const getUserById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id).select('-password');
  if (!user) return apiResponse.error(res, 'User not found', 404);

  let profile = null;
  if (user.role === 'Patient') {
    profile = await Patient.findOne({ user: user._id });
  } else if (user.role === 'Doctor') {
    profile = await Doctor.findOne({ user: user._id });
  } else if (user.role === 'Diagnostic') {
    profile = await Diagnostic.findOne({ user: user._id });
  } else if (user.role === 'Admin') {
    profile = await Admin.findOne({ user: user._id });
  }

  return apiResponse.success(res, { user, profile }, 'User retrieved successfully');
});

export const deleteUser = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) return apiResponse.error(res, 'User not found', 404);
  
  if (user.role === 'Patient') {
    await Patient.findOneAndDelete({ user: user._id });
  } else if (user.role === 'Doctor') {
    await Doctor.findOneAndDelete({ user: user._id });
  } else if (user.role === 'Diagnostic') {
    await Diagnostic.findOneAndDelete({ user: user._id });
  } else if (user.role === 'Admin') {
    await Admin.findOneAndDelete({ user: user._id });
  }
  
  await User.findByIdAndDelete(id);
  
  return apiResponse.deleted(res, 'User deleted successfully');
});

export const updateUserStatus = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { isAccountVerified } = req.body;
  
  const user = await User.findById(id);
  if (!user) return apiResponse.error(res, 'User not found', 404);
  
  user.isAccountVerified = isAccountVerified;
  await user.save();
  
  await sendVerificationStatusEmail(
    user.email,
    user.username,
    isAccountVerified ? 'Verified' : 'Rejected',
    user.role
  );
  
  await createNotification(
    user._id,
    `Account ${isAccountVerified ? 'Verified' : 'Rejected'}`,
    `Your ${user.role} account has been ${isAccountVerified ? 'verified' : 'rejected'} by the admin.`,
    isAccountVerified ? 'success' : 'error',
    '/profile'
  );
  
  return apiResponse.success(res, { isVerified: user.isAccountVerified }, `User ${isAccountVerified ? 'verified' : 'rejected'} successfully`);
});

// ============================================
// PENDING VERIFICATIONS
// ============================================

export const getPendingVerifications = handleAsync(async (req, res) => {
  const adminUser = await User.findById(req.userId);
  let query = { 
    isAccountVerified: false, 
    role: { $in: ['Doctor', 'Diagnostic'] } 
  };
  
  if (adminUser.role === 'Admin') {
    const admin = await Admin.findOne({ user: adminUser._id });
    if (admin && admin.adminLevel === 'District') {
      query = { 
        ...query, 
        district: admin.district, 
        state: admin.state 
      };
    } else if (admin && admin.adminLevel === 'State') {
      query = { 
        ...query, 
        state: admin.state 
      };
    }
  }

  const pendingUsers = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 });

  const usersWithProfiles = await Promise.all(
    pendingUsers.map(async (user) => {
      let profile = null;
      if (user.role === 'Doctor') {
        profile = await Doctor.findOne({ user: user._id });
      } else if (user.role === 'Diagnostic') {
        profile = await Diagnostic.findOne({ user: user._id });
      }
      return {
        ...user.toObject(),
        profile: profile ? {
          specialty: profile.specialty,
          qualification: profile.qualification,
          registrationNumber: profile.registrationNumber,
          hospitalAffiliation: profile.hospitalAffiliation,
          experienceDetails: profile.experienceDetails,
          experienceYears: profile.experienceYears,
          centerName: profile.centerName,
          address: profile.address,
          verificationRequested: profile.verificationRequested,
          verificationRequestDate: profile.verificationRequestDate
        } : null
      };
    })
  );

  return apiResponse.success(res, usersWithProfiles, 'Pending verifications retrieved');
});

// ============================================
// APPOINTMENT MANAGEMENT
// ============================================

export const getAllAppointments = handleAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  
  const appointments = await Appointment.find(query)
    .populate('patient', 'username email')
    .populate('doctor', 'user')
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

export const updateAppointmentStatus = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate('patient', 'username email');
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }
  
  await createNotification(
    appointment.patient._id,
    `Appointment ${status}`,
    `Your appointment has been ${status.toLowerCase()} by admin.`,
    status === 'Cancelled' ? 'error' : 'info',
    `/patient/appointments/${appointment._id}`,
    appointment._id
  );
  
  return apiResponse.success(res, appointment, 'Appointment status updated successfully');
});

export const deleteAppointment = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const appointment = await Appointment.findByIdAndDelete(id);
  
  if (!appointment) {
    return apiResponse.error(res, 'Appointment not found', 404);
  }
  
  return apiResponse.deleted(res, 'Appointment deleted successfully');
});

// ============================================
// PRESCRIPTION MANAGEMENT
// ============================================

export const getAllPrescriptions = handleAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const prescriptions = await Prescription.find()
    .populate('patient', 'username email')
    .populate('doctor', 'username')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Prescription.countDocuments();
  
  return apiResponse.paginated(res, prescriptions, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

// ============================================
// DIAGNOSTIC REPORT MANAGEMENT
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

// ============================================
// AMBULANCE REQUEST MANAGEMENT
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

// ============================================
// BASIC CRUD FUNCTIONS
// ============================================

export const getAlls = handleAsync(async (req, res) => {
  const admins = await Admin.find().populate('user', 'username email');
  return apiResponse.success(res, admins, 'Admins retrieved successfully');
});

export const getById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const admin = await Admin.findById(id).populate('user', 'username email');
  
  if (!admin) {
    return apiResponse.error(res, 'Admin not found', 404);
  }
  
  return apiResponse.success(res, admin, 'Admin retrieved successfully');
});

export const create = handleAsync(async (req, res) => {
  const admin = await Admin.create(req.body);
  return apiResponse.created(res, admin, 'Admin created successfully');
});

export const update = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const admin = await Admin.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!admin) {
    return apiResponse.error(res, 'Admin not found', 404);
  }
  
  return apiResponse.updated(res, admin, 'Admin updated successfully');
});

export const deleteAdmin = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const admin = await Admin.findByIdAndDelete(id);
  
  if (!admin) {
    return apiResponse.error(res, 'Admin not found', 404);
  }
  
  return apiResponse.deleted(res, 'Admin deleted successfully');
});