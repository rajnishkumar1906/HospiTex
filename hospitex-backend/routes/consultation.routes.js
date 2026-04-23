import { Router } from "express";
import {
  getUserConsultations,
  getConsultationById,
  getConsultationByAppointment,
  getMessages,
  sendMessage,
  addPrescription,
  processPayment,
  completeConsultation,
  startConsultation,
  joinConsultation,
  shareFile,
  markMessagesAsRead,
  endConsultation
} from "../controllers/consultation.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import roleAuth from "../middleware/role.middleware.js";
import { uploadFile } from "../middleware/upload.middleware.js";

const router = Router();

router.use(userAuth);

router.get("/my", getUserConsultations);
router.get("/appointment/:appointmentId", getConsultationByAppointment);
router.get("/:consultationId", getConsultationById);
router.get("/:consultationId/messages", getMessages);

router.post("/start", roleAuth("Doctor"), startConsultation);
router.get("/join/:roomId", joinConsultation);
router.post("/:consultationId/message", sendMessage);
router.post("/:consultationId/share-file", uploadFile, shareFile);
router.put("/:consultationId/mark-read", markMessagesAsRead);
router.put("/:consultationId/end", roleAuth("Doctor"), endConsultation);
router.post("/:consultationId/prescription", roleAuth("Doctor"), addPrescription);
router.post("/:consultationId/payment", roleAuth("Patient"), processPayment);
router.put("/:consultationId/complete", roleAuth("Doctor"), completeConsultation);

export default router;