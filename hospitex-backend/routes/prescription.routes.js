import { Router } from "express";
import {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getPrescriptionById,
  updatePrescription
} from "../controllers/prescription.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Doctor routes
router.post("/create", roleAuth("Doctor"), createPrescription);
router.get("/doctor/all", roleAuth("Doctor"), getDoctorPrescriptions);
router.put("/:prescriptionId", roleAuth("Doctor"), updatePrescription);

// Patient routes
router.get("/patient/all", roleAuth("Patient"), getPatientPrescriptions);

// Common routes
router.get("/:prescriptionId", getPrescriptionById);

export default router;
