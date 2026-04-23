import { Router } from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  getUserPayments,
  getPaymentSummary,
  simulatePaymentWebhook
} from "../controllers/payment.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

// Payment routes
router.post("/create-order", roleAuth("Patient"), createPaymentOrder);
router.post("/verify", roleAuth("Patient"), verifyPayment);
router.get("/status/:paymentId", getPaymentStatus);
router.get("/my-payments", roleAuth("Patient"), getUserPayments);
router.get("/summary", roleAuth("Patient"), getPaymentSummary);

// Webhook simulation (for testing)
router.post("/webhook/simulate", roleAuth("Admin"), simulatePaymentWebhook);

export default router;
