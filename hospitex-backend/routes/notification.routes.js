import { Router } from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notification.controller.js";
import userAuth from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(userAuth);

router.get("/", getUserNotifications);
router.patch("/:notificationId/read", markAsRead);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
