import { DiagnosticReport, User, Diagnostic, Patient } from '../models/schema.js';

// ======================== BOOK DIAGNOSTIC TEST ========================
export const bookDiagnosticTest = async (req, res) => {
  try {
    const userId = req.userId;
    const { diagnosticId, testName, testType, testDate, notes, doctorId } = req.body;

    if (!diagnosticId || !testName || !testType || !testDate) {
      return res.status(400).json({ success: false, message: "Diagnostic center, test name, type, and date are required" });
    }

    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const diagnostic = await Diagnostic.findOne({ user: diagnosticId });
    if (!diagnostic) {
      return res.status(404).json({ success: false, message: "Diagnostic center not found" });
    }

    const report = new DiagnosticReport({
      patient: userId,
      diagnostic: diagnosticId,
      testName,
      testType,
      testDate: new Date(testDate),
      notes: notes || "",
      doctor: doctorId || null,
      status: "Pending"
    });

    await report.save();

    // Add to patient's diagnostic reports
    patient.diagnosticReports.push(report._id);
    await patient.save();

    // Add to diagnostic center's reports
    diagnostic.diagnosticReports.push(report._id);
    await diagnostic.save();

    return res.status(201).json({
      success: true,
      message: "Diagnostic test booked successfully",
      report
    });

  } catch (error) {
    console.error("Book diagnostic test error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET PATIENT DIAGNOSTIC REPORTS ========================
export const getPatientReports = async (req, res) => {
  try {
    const userId = req.userId;

    const reports = await DiagnosticReport.find({ patient: userId })
      .populate('diagnostic', 'username email')
      .populate('doctor', 'username email')
      .sort({ testDate: -1 });

    return res.status(200).json({
      success: true,
      reports
    });

  } catch (error) {
    console.error("Get patient reports error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET DIAGNOSTIC CENTER REPORTS ========================
export const getDiagnosticReports = async (req, res) => {
  try {
    const userId = req.userId;

    const reports = await DiagnosticReport.find({ diagnostic: userId })
      .populate('patient', 'username email')
      .populate('doctor', 'username email')
      .sort({ testDate: -1 });

    return res.status(200).json({
      success: true,
      reports
    });

  } catch (error) {
    console.error("Get diagnostic reports error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== UPDATE DIAGNOSTIC REPORT ========================
export const updateDiagnosticReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { reportId } = req.params;
    const { results, reportFile, status, notes } = req.body;

    const report = await DiagnosticReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    // Check if user is the diagnostic center
    if (report.diagnostic.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this report" });
    }

    if (results) report.results = results;
    if (reportFile) report.reportFile = reportFile;
    if (status && ["Pending", "In Progress", "Completed"].includes(status)) {
      report.status = status;
    }
    if (notes !== undefined) report.notes = notes;

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Diagnostic report updated successfully",
      report
    });

  } catch (error) {
    console.error("Update diagnostic report error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== GET REPORT BY ID ========================
export const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await DiagnosticReport.findById(reportId)
      .populate('patient', 'username email')
      .populate('diagnostic', 'username email')
      .populate('doctor', 'username email');

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    return res.status(200).json({
      success: true,
      report
    });

  } catch (error) {
    console.error("Get report by ID error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

