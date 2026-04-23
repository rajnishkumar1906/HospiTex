import { Router } from "express";
import { body, param } from "express-validator";
import {
  getUserProfile,
  updateUserProfile,
  getAllDoctors,
  getAllDiagnostics,
  updatePatientProfile,
  updateDoctorProfile,
  getPatientMedicalHistory,
  getUserById,
  deleteUserAccount,
  changePassword,
  uploadProfileImage,
  getDoctorById,
  getDiagnosticById,
  searchUsers
} from "../controllers/user.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { uploadProfile } from "../middleware/upload.middleware.js";

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * @route GET /api/users/doctors
 * @desc Get all doctors with filters
 * @access Public
 */
router.get("/doctors", getAllDoctors);

/**
 * @route GET /api/users/doctors/:id
 * @desc Get doctor by ID
 * @access Public
 */
router.get("/doctors/:id", getDoctorById);

/**
 * @route GET /api/users/diagnostics
 * @desc Get all diagnostic centers with filters
 * @access Public
 */
router.get("/diagnostics", getAllDiagnostics);

/**
 * @route GET /api/users/diagnostics/:id
 * @desc Get diagnostic center by ID
 * @access Public
 */
router.get("/diagnostics/:id", getDiagnosticById);

/**
 * @route GET /api/users/search
 * @desc Search users by name, role, or location
 * @access Public
 */
router.get("/search", searchUsers);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * @route GET /api/users/profile
 * @desc Get current user profile
 * @access Private
 */
router.get("/profile", userAuth, getUserProfile);

/**
 * @route PUT /api/users/profile
 * @desc Update current user profile
 * @access Private
 */
router.put(
  "/profile",
  userAuth,
  [
    body("username").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Username must be between 2 and 50 characters"),
    body("state").optional().trim(),
    body("district").optional().trim(),
  ],
  validate,
  updateUserProfile
);

/**
 * @route POST /api/users/profile/image
 * @desc Upload profile image
 * @access Private
 */
router.post(
  "/profile/image",
  userAuth,
  uploadProfile,
  uploadProfileImage
);

/**
 * @route PUT /api/users/change-password
 * @desc Change user password
 * @access Private
 */
router.put(
  "/change-password",
  userAuth,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  validate,
  changePassword
);

/**
 * @route DELETE /api/users/account
 * @desc Delete user account
 * @access Private
 */
router.delete("/account", userAuth, deleteUserAccount);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID (for admins)
 * @access Private (Admin only)
 */
router.get(
  "/:id",
  userAuth,
  roleAuth("Admin"),
  getUserById
);

// ============================================
// ROLE-SPECIFIC PROFILE UPDATES
// ============================================

/**
 * @route PUT /api/users/profile/patient
 * @desc Update patient profile
 * @access Private (Patient only)
 */
router.put(
  "/profile/patient",
  userAuth,
  roleAuth("Patient"),
  [
    body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
    body("age").optional().isInt({ min: 0, max: 150 }).withMessage("Age must be between 0 and 150"),
    body("gender").optional().isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),
    body("address").optional().trim(),
    body("bloodGroup").optional().isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).withMessage("Invalid blood group"),
    body("emergencyContact").optional().isMobilePhone().withMessage("Invalid emergency contact number"),
    body("medicalHistory").optional().trim(),
  ],
  validate,
  updatePatientProfile
);

/**
 * @route PUT /api/users/profile/doctor
 * @desc Update doctor profile
 * @access Private (Doctor only)
 */
router.put(
  "/profile/doctor",
  userAuth,
  roleAuth("Doctor"),
  [
    body("specialty").optional().trim(),
    body("category").optional().isIn(["general", "specialist", "surgeon", "consultant"]).withMessage("Invalid category"),
    body("experienceYears").optional().isInt({ min: 0, max: 60 }).withMessage("Experience years must be between 0 and 60"),
    body("appointmentFee").optional().isInt({ min: 0 }).withMessage("Appointment fee must be a positive number"),
    body("location").optional().trim(),
    body("about").optional().trim(),
    body("contactNumber").optional().isMobilePhone().withMessage("Invalid contact number"),
    body("availability").optional().isArray().withMessage("Availability must be an array"),
  ],
  validate,
  updateDoctorProfile
);

// ============================================
// MEDICAL HISTORY (Doctor/Admin access)
// ============================================

/**
 * @route GET /api/users/patient/:patientId/medical-history
 * @desc Get patient medical history
 * @access Private (Doctor or Admin only)
 */
router.get(
  "/patient/:patientId/medical-history",
  userAuth,
  roleAuth("Doctor", "Admin"),
  [
    param("patientId").isMongoId().withMessage("Invalid patient ID"),
  ],
  validate,
  getPatientMedicalHistory
);

export default router;