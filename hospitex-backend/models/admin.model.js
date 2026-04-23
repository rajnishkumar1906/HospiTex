import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminLevel: { type: String, enum: ["State", "District"], required: true, default: "District" },
  state: { type: String, required: true },
  district: { type: String, default: "" }
}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);
