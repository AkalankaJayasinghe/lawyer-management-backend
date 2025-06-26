const Document = require('../models/documentModel');

// Upload a document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { title, booking } = req.body;

    const document = new Document({
      title,
      booking,
      filePath: req.file.path,
      uploadedBy: req.user._id,
    });
    await document.save();
    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};

// Retrieve all documents (optionally by booking)
exports.getAllDocuments = async (req, res) => {
  try {
    let filter = {};
    if (req.query.booking) filter.booking = req.query.booking;
    const documents = await Document.find(filter);
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving documents', error: error.message });
  }
};

// Retrieve a document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving document', error: error.message });
  }
};

// Delete a document by ID
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
};