import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, default: "" }
}, { timestamps: true });

export const Rating = mongoose.model("Rating", ratingSchema);
