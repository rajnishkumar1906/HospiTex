import { validationResult, body } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }
  next();
};

// Auth validations
export const signupValidation = [
  body('username').notEmpty().withMessage('Username is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['Patient', 'Doctor', 'Diagnostic', 'Admin']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Appointment validations
export const appointmentValidation = [
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('service').notEmpty().withMessage('Service is required')
];

// Prescription validations
export const prescriptionValidation = [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('medications').isArray({ min: 1 }).withMessage('At least one medication is required'),
  body('medications.*.name').notEmpty().withMessage('Medication name is required'),
  body('medications.*.dosage').notEmpty().withMessage('Dosage is required'),
  body('medications.*.frequency').notEmpty().withMessage('Frequency is required'),
  body('medications.*.duration').notEmpty().withMessage('Duration is required')
];

// Diagnostic validation
export const diagnosticValidation = [
  body('diagnosticId').notEmpty().withMessage('Diagnostic center ID is required'),
  body('testName').notEmpty().withMessage('Test name is required'),
  body('testType').notEmpty().withMessage('Test type is required'),
  body('testDate').isISO8601().withMessage('Valid test date is required')
];

// Ambulance validation
export const ambulanceValidation = [
  body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('emergencyType').notEmpty().withMessage('Emergency type is required'),
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required')
];
