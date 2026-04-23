import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }],
  specialty: { type: String, default: "" },
  category: { type: String, default: "general" },
  experienceYears: { type: Number, default: 0 },
  appointmentFee: { type: Number, default: 0 },
  location: { type: String, default: "" },
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  about: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  contactNumber: { type: String, default: "" },
  availability: { type: [String], default: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  averageRating: { type: Number, default: 0 },
  // Verification fields
  qualification: { type: String, default: "" },
  registrationNumber: { type: String, default: "" },
  hospitalAffiliation: { type: String, default: "" },
  experienceDetails: { type: String, default: "" },
  verificationRequested: { type: Boolean, default: false },
  verificationRequestDate: { type: Date, default: null },
  documentsSubmitted: { type: Boolean, default: false },
  documentUrls: [{ type: String, default: [] }]
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema);