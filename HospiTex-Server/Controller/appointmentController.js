import { Appointment, User, Patient, Doctor } from '../models/schema.js';

// ======================== BOOK APPOINTMENT ========================
export const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { doctorId, date, time, service, notes, appointmentFee, doctorName, doctorSpecialty, doctorLocation, doctorImage } = req.body;

    if (!doctorId || !date || !time || !service) {
      return res.status(400).json({ success: false, message: "Doctor, date, time, and service are required" });
    }

    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const appointment = new Appointment({
      patient: userId,
      doctor: doctorId,
      date: new Date(date),
      time,
      service,
      notes: notes || "",
      appointmentFee: appointmentFee || 0,
      doctorName: doctorName || "",
      doctorSpecialty: doctorSpecialty || "",
      doctorLocation: doctorLocation || "",
      doctorImage: doctorImage || "",
      status: "Pending"
    });

    await appointment.save();

    // Add to patient's appointments
    patient.appointments.push(appointment._id);
    await patient.save();

    // Add to doctor's appointments
    doctor.appointments.push(appointment._id);
    await doctor.save();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    console.error("Book appointment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET PATIENT APPOINTMENTS ========================
export const getPatientAppointments = async (req, res) => {
  try {
    const userId = req.userId;

    const appointments = await Appointment.find({ patient: userId })
      .populate('doctor', 'username email')
      .sort({ date: -1, time: -1 });

    return res.status(200).json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error("Get patient appointments error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET DOCTOR APPOINTMENTS ========================
export const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.userId;

    const appointments = await Appointment.find({ doctor: userId })
      .populate('patient', 'username email')
      .sort({ date: -1, time: -1 });

    return res.status(200).json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error("Get doctor appointments error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE APPOINTMENT STATUS ========================
export const updateAppointmentStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    if (!status || !["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status is required" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Check if user is the doctor for this appointment
    if (appointment.doctor.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this appointment" });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment
    });

  } catch (error) {
    console.error("Update appointment status error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== CANCEL APPOINTMENT ========================
export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Check if user is the patient or doctor
    if (appointment.patient.toString() !== userId.toString() && 
        appointment.doctor.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to cancel this appointment" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment
    });

  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET APPOINTMENT BY ID ========================
export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'username email')
      .populate('doctor', 'username email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.status(200).json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error("Get appointment by ID error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

