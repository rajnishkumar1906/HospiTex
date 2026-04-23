import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["Patient", "Doctor"], required: true },
  message: { type: String, default: "" },
  fileUrl: { type: String, default: "" },
  fileName: { type: String, default: "" },
  fileType: { type: String, default: "" },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

const consultationSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  roomId: { type: String, required: true, unique: true },
  meetingLink: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["scheduled", "active", "ended", "cancelled"], 
    default: "scheduled" 
  },
  scheduledTime: { type: Date, required: true },
  startedAt: { type: Date },
  endedAt: { type: Date },
  messages: [messageSchema],
  sharedFiles: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: { type: String, default: "" },
  recordingUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export const Consultation = mongoose.model("Consultation", consultationSchema);