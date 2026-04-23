import { Router } from "express";
import {
  getDoctorProfile,
  updateDoctorProfile,
  requestVerification,
  getVerificationStatus,
  updateDoctorAvailability
} from "../controllers/doctor.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";

const router = Router();

// All doctor routes require authentication and Doctor role
router.use(userAuth, roleAuth("Doctor"));

router.get("/profile", getDoctorProfile);
router.put("/profile", updateDoctorProfile);
router.post("/request-verification", requestVerification);
router.get("/verification-status", getVerificationStatus);
router.put("/availability", updateDoctorAvailability);

export default router;