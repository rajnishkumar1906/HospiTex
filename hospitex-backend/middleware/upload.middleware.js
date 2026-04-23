import multer from 'multer';
import { storage } from '../config/cloudinary.js';

// ============================================
// PROFILE IMAGE UPLOAD
// ============================================
const profileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const profileUpload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: profileFilter
});

export const uploadProfile = profileUpload.single('profileImage');

// ============================================
// CONSULTATION FILE UPLOAD
// ============================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

const consultationUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

export const uploadFile = consultationUpload.single('file');
export const uploadMultiple = consultationUpload.array('files', 5);

// ============================================
// PRESCRIPTION UPLOAD
// ============================================
const prescriptionUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

export const uploadPrescription = prescriptionUpload.single('prescription');


// ============================================
// REPORT UPLOAD
// ============================================
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/reports');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const reportUpload = multer({
  storage: reportStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

export const uploadReport = reportUpload.single('report');

// ============================================
// DEFAULT EXPORT
// ============================================
export default {
  uploadProfile,
  uploadFile,
  uploadMultiple,
  uploadPrescription,
  uploadReport
};