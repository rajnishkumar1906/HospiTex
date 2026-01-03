import { User, Patient, Doctor, Diagnostic, Admin, Appointment, Prescription, DiagnosticReport, Ambulance } from '../models/schema.js';
import { createNotification } from './notificationController.js';

// ======================== GET ADMIN DASHBOARD STATS ========================
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const [
      totalPatients,
      totalDoctors,
      totalDiagnostics,
      totalAppointments,
      totalPrescriptions,
      totalReports,
      totalAmbulances,
      pendingAppointments,
      completedAppointments,
      unverifiedDoctors,
      unverifiedDiagnostics
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Diagnostic.countDocuments(),
      Appointment.countDocuments(),
      Prescription.countDocuments(),
      DiagnosticReport.countDocuments(),
      Ambulance.countDocuments(),
      Appointment.countDocuments({ status: "Pending" }),
      Appointment.countDocuments({ status: "Completed" }),
      User.countDocuments({ role: "Doctor", isAccountVerified: false }),
      User.countDocuments({ role: "Diagnostic", isAccountVerified: false })
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalDiagnostics,
        totalAppointments,
        totalPrescriptions,
        totalReports,
        totalAmbulances,
        pendingAppointments,
        completedAppointments,
        unverifiedDoctors,
        unverifiedDiagnostics,
        totalUnverified: unverifiedDoctors + unverifiedDiagnostics
      }
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET ALL USERS ========================
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { role, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (role) {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(query).select('-password -verifyOtp -resetOtp').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET USER BY ID ========================
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const adminUser = await User.findById(userId);
    
    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const user = await User.findById(id).select('-password -verifyOtp -resetOtp');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = null;
    if (user.role === "Patient") {
      profile = await Patient.findOne({ user: id }).populate('appointments').populate('diagnosticReports');
    } else if (user.role === "Doctor") {
      profile = await Doctor.findOne({ user: id }).populate('appointments').populate('prescriptions');
    } else if (user.role === "Diagnostic") {
      profile = await Diagnostic.findOne({ user: id }).populate('diagnosticReports');
    }

    return res.status(200).json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== DELETE USER ========================
export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const adminUser = await User.findById(userId);
    
    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === userId) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete role-specific profile
    if (user.role === "Patient") {
      await Patient.findOneAndDelete({ user: id });
    } else if (user.role === "Doctor") {
      await Doctor.findOneAndDelete({ user: id });
    } else if (user.role === "Diagnostic") {
      await Diagnostic.findOneAndDelete({ user: id });
    } else if (user.role === "Admin") {
      await Admin.findOneAndDelete({ user: id });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE USER STATUS ========================
export const updateUserStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const adminUser = await User.findById(userId);
    
    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const { isAccountVerified } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (isAccountVerified !== undefined) {
      user.isAccountVerified = isAccountVerified;
    }

    await user.save();

    // Create notification for user
    if (isAccountVerified) {
      await createNotification(
        id,
        "Account Verified",
        `Congratulations! Your ${user.role} account has been verified by the admin. You can now use all features.`,
        "success",
        user.role === "Doctor" ? "/doctor-dashboard" : "/diagnostic-dashboard",
        id
      );

      // Send professional verification email
      try {
        await transporter.sendMail({
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: "Account Verified - HospiTex",
          html: verificationEmailTemplate(user.username, 'approved'),
        });
      } catch (err) {
        console.error("Verification email send failed:", err.message);
      }
    } else {
      await createNotification(
        id,
        "Account Verification Revoked",
        `Your ${user.role} account verification has been revoked. Please contact admin for more information.`,
        "warning",
        "",
        id
      );

      // Send verification revoked email
      try {
        await transporter.sendMail({
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: "Verification Status Update - HospiTex",
          html: verificationEmailTemplate(user.username, 'revoked'),
        });
      } catch (err) {
        console.error("Verification email send failed:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET ALL APPOINTMENTS ========================
export const getAllAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('patient', 'username email')
        .populate('doctor', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get all appointments error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE APPOINTMENT STATUS ========================
export const updateAppointmentStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('patient', 'username email').populate('doctor', 'username email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment
    });
  } catch (error) {
    console.error("Update appointment status error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== DELETE APPOINTMENT ========================
export const deleteAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET ALL PRESCRIPTIONS ========================
export const getAllPrescriptions = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [prescriptions, total] = await Promise.all([
      Prescription.find()
        .populate('patient', 'username email')
        .populate('doctor', 'username email')
        .populate('appointment')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Prescription.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      prescriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get all prescriptions error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET ALL DIAGNOSTIC REPORTS ========================
export const getAllDiagnosticReports = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const [reports, total] = await Promise.all([
      DiagnosticReport.find(query)
        .populate('patient', 'username email')
        .populate('diagnostic', 'username email')
        .populate('doctor', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      DiagnosticReport.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get all diagnostic reports error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET ALL AMBULANCE REQUESTS ========================
export const getAllAmbulanceRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const [ambulances, total] = await Promise.all([
      Ambulance.find(query)
        .populate('patient', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Ambulance.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      ambulances,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get all ambulance requests error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

