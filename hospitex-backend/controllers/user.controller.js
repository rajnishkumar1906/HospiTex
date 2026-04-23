import bcrypt from "bcrypt";
import { handleAsync } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User, Patient, Doctor, Diagnostic, Admin } from "../models/index.js";


export const getUserProfile = handleAsync(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
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

  return apiResponse.success(res, { user, profile }, 'Profile retrieved successfully');
});

export const updateUserProfile = handleAsync(async (req, res) => {
  const { username, state, district } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    { username, state, district },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) return apiResponse.error(res, 'User not found', 404);

  return apiResponse.success(res, user, 'Profile updated successfully');
});

export const updatePatientProfile = handleAsync(async (req, res) => {
  const { phone, age, gender, address, state, district, bloodGroup, emergencyContact, medicalHistory } = req.body;
  
  let patient = await Patient.findOne({ user: req.userId });
  
  if (!patient) {
    patient = await Patient.create({ user: req.userId });
  }
  
  patient.phone = phone || patient.phone;
  patient.age = age || patient.age;
  patient.gender = gender || patient.gender;
  patient.address = address || patient.address;
  patient.state = state || patient.state;
  patient.district = district || patient.district;
  patient.bloodGroup = bloodGroup || patient.bloodGroup;
  patient.emergencyContact = emergencyContact || patient.emergencyContact;
  patient.medicalHistory = medicalHistory || patient.medicalHistory;
  
  await patient.save();

  return apiResponse.success(res, patient, 'Patient profile updated successfully');
});

export const updateDoctorProfile = handleAsync(async (req, res) => {
  const { specialty, category, experienceYears, appointmentFee, location, state, district, about, contactNumber, availability } = req.body;
  
  let doctor = await Doctor.findOne({ user: req.userId });
  
  if (!doctor) {
    doctor = await Doctor.create({ user: req.userId });
  }
  
  doctor.specialty = specialty || doctor.specialty;
  doctor.category = category || doctor.category;
  doctor.experienceYears = experienceYears || doctor.experienceYears;
  doctor.appointmentFee = appointmentFee || doctor.appointmentFee;
  doctor.location = location || doctor.location;
  doctor.state = state || doctor.state;
  doctor.district = district || doctor.district;
  doctor.about = about || doctor.about;
  doctor.contactNumber = contactNumber || doctor.contactNumber;
  if (availability) doctor.availability = availability;
  
  await doctor.save();

  return apiResponse.success(res, doctor, 'Doctor profile updated successfully');
});


export const changePassword = handleAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.userId);
  if (!user) {
    return apiResponse.error(res, 'User not found', 404);
  }
  
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return apiResponse.error(res, 'Current password is incorrect', 401);
  }
  
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  
  return apiResponse.success(res, null, 'Password changed successfully');
});


export const deleteUserAccount = handleAsync(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return apiResponse.error(res, 'User not found', 404);
  }
  
  // Delete role-specific profile
  if (user.role === 'Patient') {
    await Patient.findOneAndDelete({ user: user._id });
  } else if (user.role === 'Doctor') {
    await Doctor.findOneAndDelete({ user: user._id });
  } else if (user.role === 'Diagnostic') {
    await Diagnostic.findOneAndDelete({ user: user._id });
  } else if (user.role === 'Admin') {
    await Admin.findOneAndDelete({ user: user._id });
  }
  
  // Delete user
  await User.findByIdAndDelete(req.userId);
  
  // Clear cookie
  res.clearCookie('token');
  
  return apiResponse.deleted(res, 'Account deleted successfully');
});


export const uploadProfileImage = handleAsync(async (req, res) => {
  if (!req.file) {
    return apiResponse.error(res, 'No file uploaded', 400);
  }
  
  const imageUrl = `/uploads/profiles/${req.file.filename}`;
  
  const user = await User.findById(req.userId);
  
  if (user.role === 'Doctor') {
    await Doctor.findOneAndUpdate(
      { user: user._id },
      { imageUrl },
      { new: true, upsert: true }
    );
  } else if (user.role === 'Patient') {
    await Patient.findOneAndUpdate(
      { user: user._id },
      { profileImage: imageUrl },
      { new: true, upsert: true }
    );
  }
  
  return apiResponse.success(res, { imageUrl }, 'Profile image uploaded successfully');
});

export const getAllDoctors = handleAsync(async (req, res) => {
  const { specialty, state, district, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (specialty) query.specialty = specialty;
  if (state) query.state = state;
  if (district) query.district = district;

  const doctors = await Doctor.find(query)
    .populate('user', 'username email')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Doctor.countDocuments(query);

  return apiResponse.paginated(res, doctors, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const getDoctorById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const doctor = await Doctor.findById(id).populate('user', 'username email');
  if (!doctor) {
    return apiResponse.error(res, 'Doctor not found', 404);
  }
  
  return apiResponse.success(res, doctor, 'Doctor retrieved successfully');
});

// ============================================
// PUBLIC ROUTES - DIAGNOSTICS
// ============================================

export const getAllDiagnostics = handleAsync(async (req, res) => {
  const { state, district, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (state) query.state = state;
  if (district) query.district = district;

  const diagnostics = await Diagnostic.find(query)
    .populate('user', 'username email')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Diagnostic.countDocuments(query);

  return apiResponse.paginated(res, diagnostics, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const getDiagnosticById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const diagnostic = await Diagnostic.findById(id).populate('user', 'username email');
  if (!diagnostic) {
    return apiResponse.error(res, 'Diagnostic center not found', 404);
  }
  
  return apiResponse.success(res, diagnostic, 'Diagnostic center retrieved successfully');
});

// ============================================
// SEARCH USERS
// ============================================

export const searchUsers = handleAsync(async (req, res) => {
  const { q, role, page = 1, limit = 10 } = req.query;
  
  const query = {};
  
  if (q) {
    query.$or = [
      { username: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (role) query.role = role;

  const users = await User.find(query)
    .select('-password')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  return apiResponse.paginated(res, users, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

// ============================================
// ADMIN ROUTES
// ============================================

export const getUserById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id).select('-password');
  if (!user) {
    return apiResponse.error(res, 'User not found', 404);
  }
  
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

// ============================================
// MEDICAL HISTORY
// ============================================

export const getPatientMedicalHistory = handleAsync(async (req, res) => {
  const { patientId } = req.params;
  
  const patient = await Patient.findOne({ user: patientId })
    .populate('appointments')
    .populate('diagnosticReports');

  if (!patient) {
    return apiResponse.error(res, 'Patient not found', 404);
  }

  return apiResponse.success(res, patient, 'Medical history retrieved successfully');
});