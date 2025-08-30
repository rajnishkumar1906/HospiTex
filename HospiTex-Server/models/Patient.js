// models/Patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  location: String,
  bloodGroup: String,
  diseaseType: String,
});

const Patient = mongoose.model("patient", patientSchema);
export default Patient;
