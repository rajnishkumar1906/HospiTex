import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  diagnosticReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "DiagnosticReport" }],
  phone: { type: String, default: "" },
  age: { type: Number, default: null },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  address: { type: String, default: "" },
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  emergencyContact: { type: String, default: "" },
  medicalHistory: { type: String, default: "" },
  profileImage: { type: String, default: "" }  // ← Add this field
}, { timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);