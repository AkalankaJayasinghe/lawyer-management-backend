const Document = require('../models/documentModel');

// Upload a document
exports.uploadDocument = async (req, res) => {
    try {
        const document = new Document({
            title: req.body.title,
            filePath: req.file.path,
            uploadedBy: req.user.id,
        });
        await document.save();
        res.status(201).json({ message: 'Document uploaded successfully', document });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading document', error });
    }
};

// Retrieve all documents
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving documents', error });
    }
};

// Retrieve a document by ID
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving document', error });
    }
};

// Delete a document by ID
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document', error });
    }
};