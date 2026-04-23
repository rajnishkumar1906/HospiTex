import mongoose from "mongoose";

const diagnosticSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnosticReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "DiagnosticReport" }],
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  centerName: { type: String, default: "" },
  address: { type: String, default: "" },
  contactNumber: { type: String, default: "" }
}, { timestamps: true });

export const Diagnostic = mongoose.model("Diagnostic", diagnosticSchema);
