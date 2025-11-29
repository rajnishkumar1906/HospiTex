import { Router } from "express";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  getAllDoctors,
  getAllDiagnostics,
  updatePatientProfileDetails,
  updateDoctorProfileDetails
} from "../Controller/userController.js";
import userAuth from "../middleware/userAuth.js";

const router = Router();

// Public routes
router.get("/doctors", getAllDoctors);
router.get("/diagnostics", getAllDiagnostics);

// Protected routes
router.use(userAuth);
router.post("/profile/create", createUserProfile);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.put("/profile/patient", updatePatientProfileDetails);
router.put("/profile/doctor", updateDoctorProfileDetails);

export default router;

