import { Router } from "express";
import {
  getAvailableSlots,
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById,
  updateDoctorAvailability,
  getDoctorSchedule
} from "../controllers/appointment.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Patient routes
router.get("/available-slots", roleAuth("Patient"), getAvailableSlots);
router.post("/book", roleAuth("Patient"), bookAppointment);  // POST /api/appointments/book
router.get("/patient", roleAuth("Patient"), getPatientAppointments);
router.delete("/:appointmentId/cancel", roleAuth("Patient", "Doctor"), cancelAppointment);

// Doctor routes
router.get("/doctor/all", roleAuth("Doctor"), getDoctorAppointments);
router.put("/:appointmentId/status", roleAuth("Doctor"), updateAppointmentStatus);
router.get("/doctor/schedule", roleAuth("Doctor"), getDoctorSchedule);
router.put("/doctor/availability", roleAuth("Doctor"), updateDoctorAvailability);

// Common routes
router.get("/:appointmentId", getAppointmentById);

export default router;