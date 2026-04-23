import { Router } from "express";
import {
  submitDoctorRating,
  getDoctorRatings,
  getUserRatingForDoctor
} from "../controllers/rating.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Patient routes
router.post("/doctor", roleAuth("Patient"), submitDoctorRating);
router.get("/doctor/:doctorId/user-rating", roleAuth("Patient"), getUserRatingForDoctor);

// Public/Protected routes
router.get("/doctor/:doctorId", getDoctorRatings);

export default router;
