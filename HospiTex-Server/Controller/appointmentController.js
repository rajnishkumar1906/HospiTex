import { Appointment, User, Patient, Doctor } from '../models/schema.js';
import { createNotification } from './notificationController.js';

// ======================== GET AVAILABLE SLOTS ========================
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ success: false, message: "Doctor ID and date are required" });
    }

    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Get doctor's availability slots
    const defaultSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
    const allSlots = doctor.availability?.length ? doctor.availability : defaultSlots;

    // Get booked appointments for this doctor on this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["Pending", "Confirmed"] }
    }).select('time');

    const bookedTimes = bookedAppointments.map(apt => apt.time);

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    return res.status(200).json({
      success: true,
      availableSlots,
      allSlots,
      bookedSlots: bookedTimes
    });

  } catch (error) {
    console.error("Get available slots error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

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

    // Check if slot is still available
    const appointmentDate = new Date(date);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      time: time,
      status: { $in: ["Pending", "Confirmed"] }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: "This time slot is already booked. Please select another time." 
      });
    }

    // Create appointment with "Confirmed" status (no admin approval needed)
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
      status: "Confirmed" // Auto-confirmed, doctor can change if needed
    });

    await appointment.save();

    // Add to patient's appointments
    patient.appointments.push(appointment._id);
    await patient.save();

    // Add to doctor's appointments
    doctor.appointments.push(appointment._id);
    await doctor.save();

    // Get patient user info for notification
    const patientUser = await User.findById(userId);

    // Create notifications
    await createNotification(
      doctorId,
      "New Appointment Booking",
      `${patientUser?.username || 'A patient'} has booked an appointment with you on ${new Date(date).toLocaleDateString()} at ${time}`,
      "appointment",
      `/doctor-dashboard/appointment-services`,
      appointment._id
    );

    await createNotification(
      userId,
      "Appointment Confirmed",
      `Your appointment with ${doctorName || 'the doctor'} is confirmed for ${new Date(date).toLocaleDateString()} at ${time}`,
      "success",
      `/patient-dashboard/appointment-history`,
      appointment._id
    );

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

    // Notify patient when doctor updates appointment status
    if (status === "Confirmed") {
      await createNotification(
        appointment.patient,
        "Appointment Confirmed",
        `Your appointment with ${appointment.doctorName || 'the doctor'} on ${new Date(appointment.date).toLocaleDateString()} has been confirmed`,
        "success",
        `/patient-dashboard/appointment-history`,
        appointment._id
      );
    } else if (status === "Completed") {
      await createNotification(
        appointment.patient,
        "Appointment Completed",
        `Your appointment on ${new Date(appointment.date).toLocaleDateString()} has been marked as completed`,
        "info",
        `/patient-dashboard/appointment-history`,
        appointment._id
      );
    } else if (status === "Cancelled") {
      await createNotification(
        appointment.patient,
        "Appointment Cancelled",
        `Your appointment on ${new Date(appointment.date).toLocaleDateString()} has been cancelled`,
        "warning",
        `/patient-dashboard/appointment-history`,
        appointment._id
      );
    }

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

