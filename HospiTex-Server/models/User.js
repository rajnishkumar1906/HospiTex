import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["Patient", "Doctor", "Diagnostic"], 
      required: true 
    },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Date, default: null },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
