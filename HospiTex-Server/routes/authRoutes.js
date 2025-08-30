// routes/authRoutes.js
import { Router } from "express";
import { 
  login, 
  logout, 
  isAuthenticated,
  sendResetOtp,
  resetPassword, 
  sendVerifyOTP, 
  signUp, 
  verifyEmail 
} from "../Controller/authController.js";  // ✅ note .js
import userAuth from "../middleware/userAuth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout",logout)
router.post("/send-verify-otp",userAuth,sendVerifyOTP);
router.post("/verify-account",userAuth,verifyEmail);
router.post("/is-auth", userAuth, isAuthenticated);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

export default router;
