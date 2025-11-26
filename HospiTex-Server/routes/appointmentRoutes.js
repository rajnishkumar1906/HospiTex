import { Router } from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById
} from "../Controller/appointmentController.js";
import userAuth from "../middleware/userAuth.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Patient routes
router.post("/book", bookAppointment);
router.get("/patient", getPatientAppointments);
router.get("/:appointmentId", getAppointmentById);
router.delete("/:appointmentId/cancel", cancelAppointment);

// Doctor routes
router.get("/doctor/all", getDoctorAppointments);
router.put("/:appointmentId/status", updateAppointmentStatus);

export default router;

