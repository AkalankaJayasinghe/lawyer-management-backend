const Lawyer = require('../models/lawyerModel');

// Add a new lawyer
exports.addLawyer = async (req, res) => {
    try {
        const newLawyer = new Lawyer(req.body);
        await newLawyer.save();
        res.status(201).json({ message: 'Lawyer added successfully', lawyer: newLawyer });
    } catch (error) {
        res.status(500).json({ message: 'Error adding lawyer', error: error.message });
    }
};

// Get all lawyers
exports.getAllLawyers = async (req, res) => {
    try {
        const lawyers = await Lawyer.find();
        res.status(200).json(lawyers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving lawyers', error: error.message });
    }
};

// Get a lawyer by ID
exports.getLawyerById = async (req, res) => {
    try {
        const lawyer = await Lawyer.findById(req.params.id);
        if (!lawyer) {
            return res.status(404).json({ message: 'Lawyer not found' });
        }
        res.status(200).json(lawyer);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving lawyer', error: error.message });
    }
};

// Update a lawyer
exports.updateLawyer = async (req, res) => {
    try {
        const updatedLawyer = await Lawyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLawyer) {
            return res.status(404).json({ message: 'Lawyer not found' });
        }
        res.status(200).json({ message: 'Lawyer updated successfully', lawyer: updatedLawyer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating lawyer', error: error.message });
    }
};

// Delete a lawyer
exports.deleteLawyer = async (req, res) => {
    try {
        const deletedLawyer = await Lawyer.findByIdAndDelete(req.params.id);
        if (!deletedLawyer) {
            return res.status(404).json({ message: 'Lawyer not found' });
        }
        res.status(200).json({ message: 'Lawyer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lawyer', error: error.message });
    }
};