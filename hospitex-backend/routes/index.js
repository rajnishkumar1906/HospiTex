import { Router } from 'express';

const router = Router();

// Public routes (no auth required)
import authRoutes from './auth.routes.js';
router.use('/auth', authRoutes);

// Protected routes (auth required)
import userRoutes from './user.routes.js';
import appointmentRoutes from './appointment.routes.js';
import prescriptionRoutes from './prescription.routes.js';
import diagnosticRoutes from './diagnostic.routes.js';
import ambulanceRoutes from './ambulance.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';
import ratingRoutes from './rating.routes.js';
import paymentRoutes from './payment.routes.js';
import doctorRoutes from './doctor.routes.js';
import meetingRoutes from './meeting.routes.js';
import consultationRoutes from './consultation.routes.js';
import botRoutes from './bot.routes.js';

// Apply auth middleware to all protected routes
import userAuth from '../middleware/auth.middleware.js';

router.use('/users', userAuth, userRoutes);
router.use('/appointments', userAuth, appointmentRoutes);
router.use('/prescriptions', userAuth, prescriptionRoutes);
router.use('/diagnostics', userAuth, diagnosticRoutes);
router.use('/ambulance', userAuth, ambulanceRoutes);
router.use('/notifications', userAuth, notificationRoutes);
router.use('/admin', userAuth, adminRoutes);
router.use('/ratings', userAuth, ratingRoutes);
router.use('/payments', userAuth, paymentRoutes);
router.use('/doctor', userAuth, doctorRoutes);
router.use('/meetings', userAuth, meetingRoutes);
router.use('/consultations', userAuth, consultationRoutes);
router.use('/bot', botRoutes); // Authentication is handled inside botRoutes

export default router;