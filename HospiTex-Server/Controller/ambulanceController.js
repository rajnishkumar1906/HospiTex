import { Ambulance, User, Patient } from '../models/schema.js';

// ======================== REQUEST AMBULANCE ========================
export const requestAmbulance = async (req, res) => {
  try {
    const userId = req.userId;
    const { pickupLocation, destination, emergencyType, patientName, contactNumber, notes } = req.body;

    if (!pickupLocation || !destination || !emergencyType || !patientName || !contactNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Pickup location, destination, emergency type, patient name, and contact number are required" 
      });
    }

    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const ambulance = new Ambulance({
      patient: userId,
      pickupLocation,
      destination,
      emergencyType,
      patientName,
      contactNumber,
      notes: notes || "",
      status: "Pending"
    });

    await ambulance.save();

    return res.status(201).json({
      success: true,
      message: "Ambulance request submitted successfully",
      ambulance
    });

  } catch (error) {
    console.error("Request ambulance error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET PATIENT AMBULANCE REQUESTS ========================
export const getPatientAmbulanceRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Ambulance.find({ patient: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {
    console.error("Get patient ambulance requests error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET ALL AMBULANCE REQUESTS (Admin/Ambulance Service) ========================
export const getAllAmbulanceRequests = async (req, res) => {
  try {
    const requests = await Ambulance.find()
      .populate('patient', 'username email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {
    console.error("Get all ambulance requests error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE AMBULANCE STATUS ========================
export const updateAmbulanceStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, estimatedTime, notes } = req.body;

    if (!status || !["Pending", "Dispatched", "In Transit", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status is required" });
    }

    const ambulance = await Ambulance.findById(requestId);
    if (!ambulance) {
      return res.status(404).json({ success: false, message: "Ambulance request not found" });
    }

    ambulance.status = status;
    if (estimatedTime) ambulance.estimatedTime = estimatedTime;
    if (notes !== undefined) ambulance.notes = notes;

    await ambulance.save();

    return res.status(200).json({
      success: true,
      message: "Ambulance status updated successfully",
      ambulance
    });

  } catch (error) {
    console.error("Update ambulance status error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET AMBULANCE REQUEST BY ID ========================
export const getAmbulanceRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const ambulance = await Ambulance.findById(requestId)
      .populate('patient', 'username email');

    if (!ambulance) {
      return res.status(404).json({ success: false, message: "Ambulance request not found" });
    }

    return res.status(200).json({
      success: true,
      ambulance
    });

  } catch (error) {
    console.error("Get ambulance request by ID error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== CANCEL AMBULANCE REQUEST ========================
export const cancelAmbulanceRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { requestId } = req.params;

    const ambulance = await Ambulance.findById(requestId);
    if (!ambulance) {
      return res.status(404).json({ success: false, message: "Ambulance request not found" });
    }

    // Check if user is the patient who made the request
    if (ambulance.patient.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to cancel this request" });
    }

    ambulance.status = "Cancelled";
    await ambulance.save();

    return res.status(200).json({
      success: true,
      message: "Ambulance request cancelled successfully",
      ambulance
    });

  } catch (error) {
    console.error("Cancel ambulance request error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

