import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from '../models/User';
import transporter from '../config/nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ======================== SIGNUP ========================
export const signUp = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Enter all credentials",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isVerified: false, // for email verification
    });
    await newUser.save();

    // Generate email verification token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NOVE_ENV === 'production',
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    try {
      await transporter.sendMail({
        from: process.env.SENDER_MAIL,
        to: email,
        Subject: "Welcome to HospiTex",
        text: `Hello ${username}, you have successfull regsitered on HospiTex!`
      })
    } catch (error) {
      res.json({
        success: false,
        message: "Failed to send mail"
      })
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================== LOGIN ========================
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Enter credentials"
    })
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({
      success: false,
      message: "Invalid email and password"
    })

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({
      success: false,
      message: 'Invalid password'
    })

    // if both email and password matches
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome Back to Hospitex",
        text: `Hello ${user.name}, you have successfully logged in!`,
      });
    } catch (err) { }

    return res.json({ success: true, message: "Login successful" });

  } catch (error) {
      return res.json({
        success: false,
        message : error.message
      })
  }
};

// ===================  LOGOUT  ===========================
export const logout = (req,res) => {
  res.clearCookie('token');
  return res.json({
    success: true,
    message : 'Logged out successfully'
  })
}

export const sendVerifyOTP = async (req, res) => {
  try {
    const userId = req.userId; // ✅ coming from middleware

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is missing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = expireAt;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your Account Verification OTP",
      text: `Hello ${user.name}, your OTP to verify your account is: ${otp}. It expires in 5 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId; 
  
  if (!otp) {
    return res.json({ success: false, message: "OTP is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = (req, res) => {
  try {
    return res.json({
      success: true,
      userId: req.userId,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const expireAt = new Date(Date.now() + 15 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpireAt = expireAt;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your Password Reset OTP",
      text: `Hello ${user.name}, your OTP to reset your password is: ${otp}. It expires in 15 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email, OTP and new password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpireAt = null;

    await user.save();

    return res.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
