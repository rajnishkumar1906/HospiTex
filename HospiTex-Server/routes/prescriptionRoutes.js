import { Router } from "express";
import {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getPrescriptionById,
  updatePrescription
} from "../Controller/prescriptionController.js";
import userAuth from "../middleware/userAuth.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Doctor routes
router.post("/create", createPrescription);
router.get("/doctor/all", getDoctorPrescriptions);
router.put("/:prescriptionId", updatePrescription);

// Patient routes
router.get("/patient/all", getPatientPrescriptions);

// Common routes
router.get("/:prescriptionId", getPrescriptionById);

export default router;

