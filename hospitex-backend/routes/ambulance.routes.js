import { Router } from "express";
import {
  requestAmbulance,
  getPatientAmbulanceRequests,
  getAllAmbulanceRequests,
  updateAmbulanceStatus,
  getAmbulanceRequestById,
  cancelAmbulanceRequest
} from "../controllers/ambulance.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Patient routes
router.post("/request", roleAuth("Patient"), requestAmbulance);
router.get("/patient/requests", roleAuth("Patient"), getPatientAmbulanceRequests);
router.delete("/:requestId/cancel", roleAuth("Patient"), cancelAmbulanceRequest);

// Admin routes
router.get("/all", roleAuth("Admin"), getAllAmbulanceRequests);
router.put("/:requestId/status", roleAuth("Admin"), updateAmbulanceStatus);

// Common routes
router.get("/:requestId", getAmbulanceRequestById);

export default router;
