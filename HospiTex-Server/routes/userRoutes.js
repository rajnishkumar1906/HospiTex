import { Router } from "express";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  getAllDoctors,
  getAllDiagnostics
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

export default router;

