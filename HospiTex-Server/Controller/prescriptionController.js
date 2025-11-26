import { Prescription, User, Patient, Doctor, Appointment } from '../models/schema.js';

// ======================== CREATE PRESCRIPTION ========================
export const createPrescription = async (req, res) => {
  try {
    const userId = req.userId;
    const { patientId, appointmentId, medications, diagnosis, notes, followUpDate } = req.body;

    if (!patientId || !medications || medications.length === 0) {
      return res.status(400).json({ success: false, message: "Patient ID and medications are required" });
    }

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const prescription = new Prescription({
      patient: patientId,
      doctor: userId,
      appointment: appointmentId || null,
      medications,
      diagnosis: diagnosis || "",
      notes: notes || "",
      followUpDate: followUpDate ? new Date(followUpDate) : null
    });

    await prescription.save();

    // Add to doctor's prescriptions
    doctor.prescriptions.push(prescription._id);
    await doctor.save();

    // Update appointment status if linked
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (appointment) {
        appointment.status = "Completed";
        await appointment.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription
    });

  } catch (error) {
    console.error("Create prescription error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET PATIENT PRESCRIPTIONS ========================
export const getPatientPrescriptions = async (req, res) => {
  try {
    const userId = req.userId;

    const prescriptions = await Prescription.find({ patient: userId })
      .populate('doctor', 'username email')
      .populate('appointment')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      prescriptions
    });

  } catch (error) {
    console.error("Get patient prescriptions error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET DOCTOR PRESCRIPTIONS ========================
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const userId = req.userId;

    const prescriptions = await Prescription.find({ doctor: userId })
      .populate('patient', 'username email')
      .populate('appointment')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      prescriptions
    });

  } catch (error) {
    console.error("Get doctor prescriptions error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET PRESCRIPTION BY ID ========================
export const getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findById(prescriptionId)
      .populate('patient', 'username email')
      .populate('doctor', 'username email')
      .populate('appointment');

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    return res.status(200).json({
      success: true,
      prescription
    });

  } catch (error) {
    console.error("Get prescription by ID error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE PRESCRIPTION ========================
export const updatePrescription = async (req, res) => {
  try {
    const userId = req.userId;
    const { prescriptionId } = req.params;
    const { medications, diagnosis, notes, followUpDate } = req.body;

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    // Check if user is the doctor who created the prescription
    if (prescription.doctor.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this prescription" });
    }

    if (medications) prescription.medications = medications;
    if (diagnosis !== undefined) prescription.diagnosis = diagnosis;
    if (notes !== undefined) prescription.notes = notes;
    if (followUpDate) prescription.followUpDate = new Date(followUpDate);

    await prescription.save();

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      prescription
    });

  } catch (error) {
    console.error("Update prescription error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

