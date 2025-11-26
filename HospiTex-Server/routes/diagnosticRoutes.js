import { Router } from "express";
import {
  bookDiagnosticTest,
  getPatientReports,
  getDiagnosticReports,
  updateDiagnosticReport,
  getReportById
} from "../Controller/diagnosticController.js";
import userAuth from "../middleware/userAuth.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Patient routes
router.post("/book", bookDiagnosticTest);
router.get("/patient/reports", getPatientReports);

// Diagnostic center routes
router.get("/diagnostic/reports", getDiagnosticReports);
router.put("/:reportId", updateDiagnosticReport);

// Common routes
router.get("/:reportId", getReportById);

export default router;

