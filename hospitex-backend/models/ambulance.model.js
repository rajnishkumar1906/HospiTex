import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  emergencyType: { type: String, required: true },
  patientName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Dispatched", "In Transit", "Completed", "Cancelled"], default: "Pending" },
  estimatedTime: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { timestamps: true });

export const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
