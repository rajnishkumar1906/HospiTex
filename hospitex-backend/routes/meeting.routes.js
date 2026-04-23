import { Router } from "express";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";
import {
  createConsultationRoom,
  joinConsultationRoom,
  endConsultation,
  getConsultationDetails,
  getDoctorActiveConsultations,
  getPatientUpcomingConsultations,
  getConsultationHistory,
  updateConsultationNotes,
  generateMeetingToken,
  checkConsultationStatus
} from "../controllers/meeting.controller.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Create consultation room (Doctor only)
router.post("/create", roleAuth("Doctor"), createConsultationRoom);

// Join consultation room (Patient or Doctor)
router.get("/join/:consultationId", joinConsultationRoom);

// End consultation (Doctor only)
router.put("/end/:consultationId", roleAuth("Doctor"), endConsultation);

// Get consultation details (Patient or Doctor)
router.get("/:consultationId", getConsultationDetails);

// Get doctor's active consultations (Doctor only)
router.get("/doctor/active", roleAuth("Doctor"), getDoctorActiveConsultations);

// Get patient's upcoming consultations (Patient only)
router.get("/patient/upcoming", roleAuth("Patient"), getPatientUpcomingConsultations);

// Get consultation history (Patient or Doctor)
router.get("/history/all", getConsultationHistory);

// Update consultation notes (Doctor only)
router.put("/notes/:consultationId", roleAuth("Doctor"), updateConsultationNotes);

// Generate meeting token (Patient or Doctor)
router.get("/token/:consultationId", generateMeetingToken);

// Check consultation status by appointment (Patient or Doctor)
router.get("/status/appointment/:appointmentId", checkConsultationStatus);

export default router;