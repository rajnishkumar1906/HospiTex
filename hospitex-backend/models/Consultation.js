import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["Patient", "Doctor"], required: true },
  message: { type: String, required: true },
  attachments: [{ type: String }],
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" },
  transactionId: { type: String },
  paymentMethod: { type: String, default: "Dummy" },
  paidAt: { type: Date }
});

const consultationSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Active", "Completed", "Cancelled"], 
    default: "Pending" 
  },
  messages: [messageSchema],
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  payment: paymentSchema,
  diagnosis: { type: String, default: "" },
  notes: { type: String, default: "" },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

export const Consultation = mongoose.model("Consultation", consultationSchema);