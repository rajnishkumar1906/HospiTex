import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Rating, Doctor, User, Appointment } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';

// ============================================
// PATIENT RATING FUNCTIONS
// ============================================

export const submitDoctorRating = handleAsync(async (req, res) => {
  const { doctorId, rating, review, appointmentId } = req.body;
  const patientId = req.userId;
  
  // Validate rating
  if (rating < 1 || rating > 5) {
    return apiResponse.error(res, 'Rating must be between 1 and 5', 400);
  }
  
  // Check if doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return apiResponse.error(res, 'Doctor not found', 404);
  }
  
  // Check if patient has already rated this doctor
  const existingRating = await Rating.findOne({
    patient: patientId,
    doctor: doctorId
  });
  
  if (existingRating) {
    // Update existing rating
    existingRating.rating = rating;
    existingRating.review = review || existingRating.review;
    existingRating.appointment = appointmentId || existingRating.appointment;
    await existingRating.save();
    
    // Recalculate average rating
    await updateDoctorAverageRating(doctorId);
    
    return apiResponse.success(res, existingRating, 'Rating updated successfully');
  }
  
  // Create new rating
  const newRating = await Rating.create({
    patient: patientId,
    doctor: doctorId,
    appointment: appointmentId || null,
    rating,
    review: review || ''
  });
  
  // Update doctor's average rating
  await updateDoctorAverageRating(doctorId);
  
  // Create notification for doctor
  await createNotification(
    doctor.user,
    'New Rating Received',
    `You have received a ${rating} star rating from a patient.`,
    'success',
    `/doctor/ratings`,
    newRating._id
  );
  
  return apiResponse.created(res, newRating, 'Rating submitted successfully');
});

export const getUserRatingForDoctor = handleAsync(async (req, res) => {
  const { doctorId } = req.params;
  const patientId = req.userId;
  
  const rating = await Rating.findOne({
    patient: patientId,
    doctor: doctorId
  });
  
  if (!rating) {
    return apiResponse.success(res, null, 'No rating found for this doctor');
  }
  
  return apiResponse.success(res, rating, 'Rating retrieved successfully');
});

export const updateMyRating = handleAsync(async (req, res) => {
  const { ratingId } = req.params;
  const { rating, review } = req.body;
  const patientId = req.userId;
  
  // Validate rating
  if (rating && (rating < 1 || rating > 5)) {
    return apiResponse.error(res, 'Rating must be between 1 and 5', 400);
  }
  
  const ratingDoc = await Rating.findOneAndUpdate(
    { _id: ratingId, patient: patientId },
    { rating, review },
    { new: true, runValidators: true }
  );
  
  if (!ratingDoc) {
    return apiResponse.error(res, 'Rating not found or unauthorized', 404);
  }
  
  // Recalculate doctor's average rating
  await updateDoctorAverageRating(ratingDoc.doctor);
  
  return apiResponse.success(res, ratingDoc, 'Rating updated successfully');
});

export const deleteMyRating = handleAsync(async (req, res) => {
  const { ratingId } = req.params;
  const patientId = req.userId;
  
  const rating = await Rating.findOneAndDelete({
    _id: ratingId,
    patient: patientId
  });
  
  if (!rating) {
    return apiResponse.error(res, 'Rating not found or unauthorized', 404);
  }
  
  // Recalculate doctor's average rating
  await updateDoctorAverageRating(rating.doctor);
  
  return apiResponse.deleted(res, 'Rating deleted successfully');
});

// ============================================
// DOCTOR RATING FUNCTIONS
// ============================================

export const getDoctorRatings = handleAsync(async (req, res) => {
  const { doctorId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  // Check if doctor exists
  const doctor = await Doctor.findById(doctorId).populate('user', 'username');
  if (!doctor) {
    return apiResponse.error(res, 'Doctor not found', 404);
  }
  
  const ratings = await Rating.find({ doctor: doctorId })
    .populate('patient', 'username')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Rating.countDocuments({ doctor: doctorId });
  
  // Calculate rating distribution
  const distribution = {
    5: await Rating.countDocuments({ doctor: doctorId, rating: 5 }),
    4: await Rating.countDocuments({ doctor: doctorId, rating: 4 }),
    3: await Rating.countDocuments({ doctor: doctorId, rating: 3 }),
    2: await Rating.countDocuments({ doctor: doctorId, rating: 2 }),
    1: await Rating.countDocuments({ doctor: doctorId, rating: 1 })
  };
  
  return apiResponse.paginated(res, {
    doctor: {
      id: doctor._id,
      name: doctor.user?.username,
      specialty: doctor.specialty,
      averageRating: doctor.averageRating || 0,
      totalRatings: total
    },
    distribution,
    ratings
  }, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const getMyDoctorRatings = handleAsync(async (req, res) => {
  const doctorId = req.userId;
  
  // Find doctor profile
  const doctor = await Doctor.findOne({ user: doctorId });
  if (!doctor) {
    return apiResponse.error(res, 'Doctor profile not found', 404);
  }
  
  const { page = 1, limit = 10 } = req.query;
  
  const ratings = await Rating.find({ doctor: doctor._id })
    .populate('patient', 'username')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Rating.countDocuments({ doctor: doctor._id });
  
  return apiResponse.paginated(res, ratings, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

const updateDoctorAverageRating = async (doctorId) => {
  const result = await Rating.aggregate([
    { $match: { doctor: doctorId } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  const averageRating = result.length > 0 ? Math.round(result[0].average * 10) / 10 : 0;
  
  await Doctor.findByIdAndUpdate(doctorId, { averageRating });
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

export const getAllRatings = handleAsync(async (req, res) => {
  const { page = 1, limit = 10, doctorId } = req.query;
  
  const query = {};
  if (doctorId) query.doctor = doctorId;
  
  const ratings = await Rating.find(query)
    .populate('patient', 'username email')
    .populate('doctor', 'user')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Rating.countDocuments(query);
  
  return apiResponse.paginated(res, ratings, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const deleteRating = handleAsync(async (req, res) => {
  const { ratingId } = req.params;
  
  const rating = await Rating.findByIdAndDelete(ratingId);
  
  if (!rating) {
    return apiResponse.error(res, 'Rating not found', 404);
  }
  
  // Recalculate doctor's average rating
  await updateDoctorAverageRating(rating.doctor);
  
  return apiResponse.deleted(res, 'Rating deleted successfully');
});

// ============================================
// BASIC CRUD FUNCTIONS (for backward compatibility)
// ============================================

export const getAlls = handleAsync(async (req, res) => {
  const ratings = await Rating.find()
    .populate('patient', 'username')
    .populate('doctor', 'user');
  
  return apiResponse.success(res, ratings, 'Ratings retrieved successfully');
});

export const getById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const rating = await Rating.findById(id)
    .populate('patient', 'username')
    .populate('doctor', 'user');
  
  if (!rating) {
    return apiResponse.error(res, 'Rating not found', 404);
  }
  
  return apiResponse.success(res, rating, 'Rating retrieved successfully');
});

export const create = handleAsync(async (req, res) => {
  const rating = await Rating.create(req.body);
  
  // Update doctor's average rating
  await updateDoctorAverageRating(rating.doctor);
  
  return apiResponse.created(res, rating, 'Rating created successfully');
});

export const update = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const rating = await Rating.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!rating) {
    return apiResponse.error(res, 'Rating not found', 404);
  }
  
  // Update doctor's average rating
  await updateDoctorAverageRating(rating.doctor);
  
  return apiResponse.updated(res, rating, 'Rating updated successfully');
});

export const deleteRatingById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const rating = await Rating.findByIdAndDelete(id);
  
  if (!rating) {
    return apiResponse.error(res, 'Rating not found', 404);
  }
  
  // Update doctor's average rating
  await updateDoctorAverageRating(rating.doctor);
  
  return apiResponse.deleted(res, 'Rating deleted successfully');
});