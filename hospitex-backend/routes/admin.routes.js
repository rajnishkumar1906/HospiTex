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
  getAllAmbulanceRequests,
  getPendingVerifications
} from "../controllers/admin.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";

const router = Router();

// All admin routes require authentication and Admin role
router.use(userAuth, roleAuth("Admin"));

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


// Add this line with other routes
router.get("/verifications/pending", getPendingVerifications);

export default router;
