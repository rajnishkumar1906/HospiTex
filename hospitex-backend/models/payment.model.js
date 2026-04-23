import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  diagnosticReport: { type: mongoose.Schema.Types.ObjectId, ref: "DiagnosticReport" },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["Pending", "Success", "Failed", "Refunded"], default: "Pending" },
  paymentMethod: { type: String, default: "" },
  transactionId: { type: String, unique: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String }
}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema);
