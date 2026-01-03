// server.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from 'cors'
import authRoutes from './routes/authRoutes.js';
import medibotRoutes from './Medibot/medibot.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import diagnosticRoutes from './routes/diagnosticRoutes.js';
import ambulanceRoutes from './routes/ambulanceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// DB connect
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/medibot", medibotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/diagnostics", diagnosticRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// User


app.get("/", (req, res) => res.send("HospiTex API Running ✅"));

// Server start
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
