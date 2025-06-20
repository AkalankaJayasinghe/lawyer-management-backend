const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Route to upload a document
router.post('/upload', authMiddleware.verifyToken, uploadMiddleware.single('document'), documentController.uploadDocument);

// Route to retrieve a document by ID
router.get('/:id', authMiddleware.verifyToken, documentController.getDocumentById);

// Route to delete a document by ID
router.delete('/:id', authMiddleware.verifyToken, documentController.deleteDocumentById);

// Route to list all documents
router.get('/', authMiddleware.verifyToken, documentController.getAllDocuments);

module.exports = router;