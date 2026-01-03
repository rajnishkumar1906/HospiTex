import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserStatus,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAllPrescriptions,
  getAllDiagnosticReports,
  getAllAmbulanceRequests
} from "../Controller/adminController.js";
import userAuth from "../middleware/userAuth.js";

const router = Router();

// All admin routes require authentication
router.use(userAuth);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/status", updateUserStatus);

// Appointment Management
router.get("/appointments", getAllAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.delete("/appointments/:id", deleteAppointment);

// Prescription Management
router.get("/prescriptions", getAllPrescriptions);

// Diagnostic Report Management
router.get("/diagnostic-reports", getAllDiagnosticReports);

// Ambulance Request Management
router.get("/ambulance-requests", getAllAmbulanceRequests);

export default router;

