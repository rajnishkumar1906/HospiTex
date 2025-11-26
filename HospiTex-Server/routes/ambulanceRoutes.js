import { Router } from "express";
import {
  requestAmbulance,
  getPatientAmbulanceRequests,
  getAllAmbulanceRequests,
  updateAmbulanceStatus,
  getAmbulanceRequestById,
  cancelAmbulanceRequest
} from "../Controller/ambulanceController.js";
import userAuth from "../middleware/userAuth.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Patient routes
router.post("/request", requestAmbulance);
router.get("/patient/requests", getPatientAmbulanceRequests);
router.delete("/:requestId/cancel", cancelAmbulanceRequest);

// Admin/Ambulance service routes
router.get("/all", getAllAmbulanceRequests);
router.put("/:requestId/status", updateAmbulanceStatus);

// Common routes
router.get("/:requestId", getAmbulanceRequestById);

export default router;

