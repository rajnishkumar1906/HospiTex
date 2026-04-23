import mongoose from "mongoose";

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
  followUpDate: { type: Date },
  fileUrl: { type: String, default: "" },
  fileName: { type: String, default: "" }
}, { timestamps: true });

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
