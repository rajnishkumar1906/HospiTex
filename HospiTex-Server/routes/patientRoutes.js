// routes/authRoutes.js
import { Router } from "express";
import { login, resentOtp, resetPassword, signUp, verifyEmail } from "../Controller/authController.js"; 

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/email-verify", verifyEmail);
router.post("/resend-otp", resentOtp);
router.post("/reset-password", resetPassword);

export default router;