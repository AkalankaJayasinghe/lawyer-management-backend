const express = require('express');
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to upload a new document
router.post('/upload', protect, documentController.uploadDocument);

// Route to get all documents (filtered by user permission)
router.get('/', protect, documentController.getAllDocuments);

// Route to get document by ID
router.get('/:id', protect, documentController.getDocumentById);

// Route to delete document by ID
router.delete('/:id', protect, documentController.deleteDocument);

module.exports = router;