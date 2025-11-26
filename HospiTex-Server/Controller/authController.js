import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {User, Patient, Doctor, Diagnostic} from '../models/schema.js'
import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";

dotenv.config();

// ================== Helper ==================
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ======================== SIGNUP ========================
export const signUp = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role, // store as-is: Patient, Doctor, Diagnostic
      isAccountVerified: false,
    });

    await newUser.save();

    // Create role-specific profile
    try {
      if (newUser.role === "Patient") {
        const patient = new Patient({ user: newUser._id });
        await patient.save();
      } else if (newUser.role === "Doctor") {
        const doctor = new Doctor({ user: newUser._id });
        await doctor.save();
      } else if (newUser.role === "Diagnostic") {
        const diagnostic = new Diagnostic({ user: newUser._id });
        await diagnostic.save();
      }
    } catch (profileError) {
      console.error("Profile creation error:", profileError);
      // Continue even if profile creation fails
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to HospiTex",
        text: `Hello ${username}, you have successfully registered on HospiTex!`,
      });
    } catch (err) {
      console.error("Email send failed:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
      role: newUser.role,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================== LOGIN ========================
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome Back to HospiTex",
        text: `Hello ${user.username}, you have successfully logged in!`,
      });
    } catch (err) {
      console.error("Login email failed:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
      role: user.role,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================== LOGOUT ========================
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// =================== SEND VERIFY OTP ===================
export const sendVerifyOTP = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ success: false, message: "User ID missing" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = expireAt;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Hello ${user.username}, your OTP is: ${otp}. It expires in 5 minutes.`,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =================== VERIFY EMAIL ===================
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;

  if (!otp) return res.status(400).json({ success: false, message: "OTP required" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.verifyOtp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (user.verifyOtpExpireAt < Date.now()) return res.status(400).json({ success: false, message: "OTP expired" });

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =================== AUTH CHECK ===================
export const isAuthenticated = (req, res) => {
  try {
    return res.status(200).json({ success: true, userId: req.userId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =================== SEND RESET OTP ===================
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const expireAt = new Date(Date.now() + 15 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpireAt = expireAt;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Hello ${user.username}, your OTP to reset your password is: ${otp}. It expires in 15 minutes.`,
    });

    return res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =================== RESET PASSWORD ===================
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, OTP and new password required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (user.resetOtpExpireAt < Date.now()) return res.status(400).json({ success: false, message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
