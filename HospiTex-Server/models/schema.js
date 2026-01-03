import mongoose from "mongoose";

// --- User Schema ---
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["Patient", "Doctor", "Diagnostic", "Admin"], 
      required: true 
    },
    // Location fields for pan-India system
    state: { type: String, default: "" }, // Required for Doctor, Diagnostic, Admin
    district: { type: String, default: "" }, // Required for Doctor, Diagnostic, District Admin
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Date, default: null },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// --- Patient Schema ---
const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  diagnosticReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "DiagnosticReport" }],
  phone: { type: String, default: "" },
  age: { type: Number, default: null },
  gender: { type: String, default: "" },
  address: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  emergencyContact: { type: String, default: "" },
  medicalHistory: { type: String, default: "" }
}, { timestamps: true });
const Patient = mongoose.model("Patient", patientSchema);

// --- Doctor Schema ---
const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }],
  specialty: { type: String, default: "" },
  category: { type: String, default: "general" },
  experienceYears: { type: Number, default: 0 },
  appointmentFee: { type: Number, default: 0 },
  location: { type: String, default: "" },
  state: { type: String, default: "" }, // Required - for district admin verification
  district: { type: String, default: "" }, // Required - for district admin verification
  about: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  contactNumber: { type: String, default: "" },
  availability: { type: [String], default: [] }
}, { timestamps: true });
const Doctor = mongoose.model("Doctor", doctorSchema);

// --- Diagnostic Center Schema ---
const diagnosticSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnosticReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "DiagnosticReport" }],
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  state: { type: String, default: "" }, // Required - for district admin verification
  district: { type: String, default: "" }, // Required - for district admin verification
  centerName: { type: String, default: "" },
  address: { type: String, default: "" },
  contactNumber: { type: String, default: "" }
}, { timestamps: true });
const Diagnostic = mongoose.model("Diagnostic", diagnosticSchema);

// --- Admin Schema (with hierarchy: State Admin and District Admin) ---
const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Admin hierarchy for pan-India system
  adminLevel: { 
    type: String, 
    enum: ["State", "District"], 
    required: true,
    default: "District"
  }, // State Admin or District Admin
  state: { type: String, required: true }, // Required for both State and District Admin
  district: { type: String, default: "" }, // Required for District Admin, null for State Admin
  
  // Track all users by role (filtered by district/state based on adminLevel)
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  diagnostics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Diagnostic" }],

  // Optional: track all appointments and reports globally
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }],
  diagnosticReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "DiagnosticReport" }]
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

// --- Appointment Schema ---
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"], 
    default: "Pending" 
  },
  notes: { type: String, default: "" },
  appointmentFee: { type: Number, default: 0 },
  doctorName: { type: String },
  doctorSpecialty: { type: String },
  doctorLocation: { type: String },
  doctorImage: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

// --- Prescription Schema ---
const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, default: "" }
  }],
  diagnosis: { type: String, default: "" },
  notes: { type: String, default: "" },
  followUpDate: { type: Date }
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);

// --- Diagnostic Report Schema ---
const diagnosticReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnostic: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  testName: { type: String, required: true },
  testType: { type: String, required: true },
  testDate: { type: Date, required: true },
  results: { type: mongoose.Schema.Types.Mixed, default: {} },
  reportFile: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed"], 
    default: "Pending" 
  },
  notes: { type: String, default: "" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const DiagnosticReport = mongoose.model("DiagnosticReport", diagnosticReportSchema);

// --- Ambulance Request Schema ---
const ambulanceSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  emergencyType: { type: String, required: true },
  patientName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Dispatched", "In Transit", "Completed", "Cancelled"], 
    default: "Pending" 
  },
  estimatedTime: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { timestamps: true });

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);

// --- Notification Schema ---
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["info", "success", "warning", "error", "appointment", "verification", "report"],
    default: "info"
  },
  link: { type: String, default: "" },
  isRead: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId } // ID of related entity (appointment, etc.)
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export { 
  User, Patient, Doctor, Diagnostic, Admin,
  Appointment, Prescription, DiagnosticReport, Ambulance, Notification
};
