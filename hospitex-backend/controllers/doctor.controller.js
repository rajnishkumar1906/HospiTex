import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Doctor, User, Admin } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';

export const getDoctorProfile = handleAsync(async (req, res) => {
  const userId = req.userId;
  
  const doctor = await Doctor.findOne({ user: userId }).populate('user', '-password');
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  return apiResponse.success(res, doctor, 'Doctor profile retrieved');
});

export const updateDoctorProfile = handleAsync(async (req, res) => {
  const userId = req.userId;
  const updateData = req.body;
  
  const doctor = await Doctor.findOneAndUpdate(
    { user: userId },
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  return apiResponse.success(res, doctor, 'Doctor profile updated');
});

export const requestVerification = handleAsync(async (req, res) => {
  const { qualification, registrationNumber, hospitalAffiliation, experienceDetails } = req.body;
  const userId = req.userId;
  
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  // Update doctor with verification details
  doctor.qualification = qualification || doctor.qualification;
  doctor.registrationNumber = registrationNumber || doctor.registrationNumber;
  doctor.hospitalAffiliation = hospitalAffiliation || doctor.hospitalAffiliation;
  doctor.experienceDetails = experienceDetails || doctor.experienceDetails;
  doctor.verificationRequested = true;
  doctor.verificationRequestDate = new Date();
  doctor.documentsSubmitted = true;
  
  await doctor.save();
  
  // Get doctor user info
  const doctorUser = await User.findById(userId);
  
  // Notify all admins
  const admins = await User.find({ role: 'Admin' });
  for (const admin of admins) {
    await createNotification(
      admin._id,
      'New Doctor Verification Request',
      `Dr. ${doctorUser?.username || 'A doctor'} has requested verification. Please review their credentials.`,
      'verification',
      '/admin/verifications',
      doctor._id
    );
  }
  
  return apiResponse.success(res, { 
    verificationRequested: true,
    message: 'Verification request submitted successfully. Admin will review your credentials.'
  }, 'Verification request submitted');
});

export const getVerificationStatus = handleAsync(async (req, res) => {
  const userId = req.userId;
  
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  const user = await User.findById(userId);
  
  return apiResponse.success(res, {
    isVerified: user?.isAccountVerified || false,
    verificationRequested: doctor.verificationRequested || false,
    verificationRequestDate: doctor.verificationRequestDate,
    qualification: doctor.qualification,
    registrationNumber: doctor.registrationNumber,
    hospitalAffiliation: doctor.hospitalAffiliation,
    experienceDetails: doctor.experienceDetails
  }, 'Verification status retrieved');
});

export const updateDoctorAvailability = handleAsync(async (req, res) => {
  const { availability } = req.body;
  const userId = req.userId;
  
  const doctor = await Doctor.findOneAndUpdate(
    { user: userId },
    { availability },
    { new: true }
  );
  
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  return apiResponse.success(res, doctor.availability, 'Availability updated');
});