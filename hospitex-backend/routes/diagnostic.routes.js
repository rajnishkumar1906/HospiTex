import { Router } from "express";
import {
  bookDiagnosticTest,
  getPatientReports,
  getDiagnosticReports,
  updateDiagnosticReport,
  getReportById,
  doctorRequestDiagnosticTest
} from "../controllers/diagnostic.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Patient routes
router.post("/book", roleAuth("Patient"), bookDiagnosticTest);
router.get("/patient/reports", roleAuth("Patient"), getPatientReports);

// Doctor routes
router.post("/doctor/request", roleAuth("Doctor"), doctorRequestDiagnosticTest);

// Diagnostic center routes
router.get("/diagnostic/reports", roleAuth("Diagnostic"), getDiagnosticReports);
router.put("/:reportId", roleAuth("Diagnostic"), updateDiagnosticReport);

// Common routes
router.get("/:reportId", getReportById);

export default router;
