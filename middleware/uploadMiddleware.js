const multer = require('multer');
const path = require('path');

// Allowed extensions and mimetypes
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    // Use timestamp and original name to avoid collisions
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
  }
};

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter
});

module.exports = upload;