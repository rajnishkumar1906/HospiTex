import mongoose from "mongoose";

const diagnosticReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnostic: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  testName: { type: String, required: true },
  testType: { type: String, required: true },
  testDate: { type: Date, required: true },
  results: { type: mongoose.Schema.Types.Mixed, default: {} },
  reportFile: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  notes: { type: String, default: "" }
}, { timestamps: true });

export const DiagnosticReport = mongoose.model("DiagnosticReport", diagnosticReportSchema);
