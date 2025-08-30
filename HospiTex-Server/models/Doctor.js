// models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  specialization: String,
  experience: Number,
  location: String,
});

const Doctor = mongoose.model("doctor", doctorSchema);
export default Doctor;
