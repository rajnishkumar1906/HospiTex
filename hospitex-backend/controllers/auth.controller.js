import bcrypt from 'bcrypt';
import { User, Patient, Doctor, Diagnostic, Admin } from '../models/index.js';
import { generateToken } from '../utils/tokenGenerator.js';
import { generateOTP, isOTPExpired } from '../utils/otpGenerator.js';
import { sendOtpEmail, sendWelcomeEmail, sendLoginNotification } from '../services/email.service.js';
import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

export const signUp = handleAsync(async (req, res) => {
  const { username, email, password, role, state, district } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return apiResponse.error(res, 'Email already registered', 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username, email, password: hashedPassword, role,
    state, district,
    isAccountVerified: role === 'Patient' || role === 'Admin'
  });

  if (role === 'Patient') {
    await Patient.create({ 
      user: user._id,
      gender: 'Other',  
      phone: '',
      age: null,
      address: '',
      state: state || '',
      district: district || '',
      bloodGroup: '',
      emergencyContact: '',
      medicalHistory: ''
    });
  } 
  else if (role === 'Doctor') {
    await Doctor.create({ 
      user: user._id,
      specialty: '',
      category: 'general',
      experienceYears: 0,
      appointmentFee: 0,
      location: '',
      state: state || '',
      district: district || '',
      about: '',
      contactNumber: ''
    });
  } 
  else if (role === 'Diagnostic') {
    await Diagnostic.create({ 
      user: user._id,
      state: state || '',
      district: district || '',
      centerName: '',
      address: '',
      contactNumber: ''
    });
  } 
  else if (role === 'Admin') {
    await Admin.create({ 
      user: user._id, 
      adminLevel: 'District', 
      state: state || '', 
      district: district || '' 
    });
  }

  const token = generateToken(user._id);
  
  // Set HTTP-only cookie
  res.cookie('token', token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });

  // Send welcome email
  await sendWelcomeEmail(email, username, role);
  
  // Send OTP for email verification if not auto-verified
  if (!user.isAccountVerified) {
    const otp = generateOTP();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOtpEmail(email, otp, 'email verification');
  }

  return apiResponse.success(res, { 
    user: { 
      id: user._id, 
      username: user.username,
      email: user.email, 
      role: user.role, 
      isVerified: user.isAccountVerified 
    },
    token: token
  }, 'Signup successful', 201);
});

export const login = handleAsync(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return apiResponse.error(res, 'Invalid credentials', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return apiResponse.error(res, 'Invalid credentials', 401);

  // Allow all users to login even if not verified
  // Just add a warning message instead of blocking
  let warning = null;
  if (!user.isAccountVerified && user.role !== 'Patient' && user.role !== 'Admin') {
    warning = 'Your account is pending admin verification. Some features may be limited.';
  }

  const token = generateToken(user._id);
  
  // Set HTTP-only cookie
  res.cookie('token', token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });

  // Send login notification email
  await sendLoginNotification(email, user.username);

  return apiResponse.success(res, { 
    user: { 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      username: user.username,
      isVerified: user.isAccountVerified
    },
    token: token,
    warning: warning
  }, 'Login successful');
});

export const logout = handleAsync(async (req, res) => {
  res.clearCookie('token');
  return apiResponse.success(res, null, 'Logged out successfully');
});

export const sendVerifyOTP = handleAsync(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return apiResponse.error(res, 'User not found', 404);

  const otp = generateOTP();
  user.verifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtpEmail(user.email, otp, 'email verification');
  return apiResponse.success(res, null, 'OTP sent successfully');
});

export const verifyEmail = handleAsync(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return apiResponse.error(res, 'User not found', 404);

  if (user.verifyOtp !== otp) return apiResponse.error(res, 'Invalid OTP', 400);
  if (isOTPExpired(user.verifyOtpExpireAt)) return apiResponse.error(res, 'OTP expired', 400);

  user.isAccountVerified = true;
  user.verifyOtp = '';
  user.verifyOtpExpireAt = null;
  await user.save();

  return apiResponse.success(res, null, 'Email verified successfully');
});

export const isAuthenticated = handleAsync(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return apiResponse.error(res, 'User not found', 404);

  return apiResponse.success(res, { user }, 'Authenticated');
});

export const sendResetOtp = handleAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return apiResponse.error(res, 'User not found', 404);

  const otp = generateOTP();
  user.resetOtp = otp;
  user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtpEmail(email, otp, 'password reset');
  return apiResponse.success(res, null, 'Reset OTP sent successfully');
});

export const resetPassword = handleAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return apiResponse.error(res, 'User not found', 404);

  if (user.resetOtp !== otp) return apiResponse.error(res, 'Invalid OTP', 400);
  if (isOTPExpired(user.resetOtpExpireAt)) return apiResponse.error(res, 'OTP expired', 400);

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = '';
  user.resetOtpExpireAt = null;
  await user.save();

  return apiResponse.success(res, null, 'Password reset successfully');
});