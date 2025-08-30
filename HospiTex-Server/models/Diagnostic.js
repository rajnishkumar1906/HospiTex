// models/Diagnostic.js
import mongoose from "mongoose";

const diagnosticSchema = new mongoose.Schema({
  services: [String],   // e.g. ["Blood Test", "X-Ray", "MRI"]
  location: String,
});

const Diagnostic = mongoose.model("diagnostic", diagnosticSchema);
export default Diagnostic;
