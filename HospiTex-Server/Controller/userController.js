import { User, Patient, Doctor, Diagnostic } from '../models/schema.js';

// ======================== CREATE USER PROFILE ========================
export const createUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if profile already exists
    let existingProfile = null;
    if (user.role === "Patient") {
      existingProfile = await Patient.findOne({ user: userId });
      if (!existingProfile) {
        const patient = new Patient({ user: userId });
        await patient.save();
        return res.status(201).json({ success: true, message: "Patient profile created", profile: patient });
      }
    } else if (user.role === "Doctor") {
      existingProfile = await Doctor.findOne({ user: userId });
      if (!existingProfile) {
        const doctor = new Doctor({ user: userId });
        await doctor.save();
        return res.status(201).json({ success: true, message: "Doctor profile created", profile: doctor });
      }
    } else if (user.role === "Diagnostic") {
      existingProfile = await Diagnostic.findOne({ user: userId });
      if (!existingProfile) {
        const diagnostic = new Diagnostic({ user: userId });
        await diagnostic.save();
        return res.status(201).json({ success: true, message: "Diagnostic profile created", profile: diagnostic });
      }
    }

    return res.status(200).json({ success: true, message: "Profile already exists", profile: existingProfile });

  } catch (error) {
    console.error("Create user profile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET USER PROFILE ========================
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = null;
    if (user.role === "Patient") {
      profile = await Patient.findOne({ user: userId }).populate('appointments').populate('diagnosticReports');
    } else if (user.role === "Doctor") {
      profile = await Doctor.findOne({ user: userId }).populate('appointments').populate('prescriptions');
    } else if (user.role === "Diagnostic") {
      profile = await Diagnostic.findOne({ user: userId }).populate('diagnosticReports');
    }

    return res.status(200).json({
      success: true,
      user,
      profile
    });

  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE USER PROFILE ========================
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (username) user.username = username;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Update user profile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET ALL DOCTORS ========================
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'username email')
      .select('-appointments -prescriptions');

    return res.status(200).json({
      success: true,
      doctors
    });

  } catch (error) {
    console.error("Get all doctors error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET ALL DIAGNOSTIC CENTERS ========================
export const getAllDiagnostics = async (req, res) => {
  try {
    const diagnostics = await Diagnostic.find()
      .populate('user', 'username email')
      .select('-diagnosticReports');

    return res.status(200).json({
      success: true,
      diagnostics
    });

  } catch (error) {
    console.error("Get all diagnostics error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE PATIENT PROFILE DETAILS ========================
export const updatePatientProfileDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const allowedFields = ["phone", "age", "gender", "address", "bloodGroup", "emergencyContact", "medicalHistory"];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    let patient = await Patient.findOne({ user: userId });
    if (!patient) {
      patient = new Patient({ user: userId });
    }

    Object.assign(patient, updates);
    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update patient profile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE DOCTOR PROFILE DETAILS ========================
export const updateDoctorProfileDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const allowedFields = [
      "specialty",
      "category",
      "experienceYears",
      "appointmentFee",
      "location",
      "about",
      "imageUrl",
      "contactNumber",
      "availability",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.category) {
      updates.category = updates.category.toLowerCase();
    }

    if (updates.availability && !Array.isArray(updates.availability)) {
      updates.availability = String(updates.availability)
        .split(",")
        .map((slot) => slot.trim())
        .filter(Boolean);
    }

    let doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      doctor = new Doctor({ user: userId });
    }

    Object.assign(doctor, updates);
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

