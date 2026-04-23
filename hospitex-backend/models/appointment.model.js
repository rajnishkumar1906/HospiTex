import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },  // Change from "User" to "Doctor"
  date: { type: Date, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
  notes: { type: String, default: "" },
  appointmentFee: { type: Number, default: 0 },
  doctorName: { type: String },
  doctorSpecialty: { type: String },
  doctorLocation: { type: String },
  doctorImage: { type: String }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);