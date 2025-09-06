// server.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:allowedOrigins,
    credentials : true
}))

// DB connect
connectDB();

// Routes
app.use("/auth",authRoutes)

// User


app.get("/", (req, res) => res.send("HospiTex API Running ✅"));

// Server start
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
