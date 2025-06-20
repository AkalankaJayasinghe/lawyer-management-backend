const express = require('express');
const router = express.Router();
const lawyerController = require('../controllers/lawyerController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all lawyers
router.get('/', lawyerController.getAllLawyers);

// Route to get a lawyer by ID
router.get('/:id', lawyerController.getLawyerById);

// Route to create a new lawyer
router.post('/', authMiddleware.verifyToken, lawyerController.createLawyer);

// Route to update a lawyer by ID
router.put('/:id', authMiddleware.verifyToken, lawyerController.updateLawyer);

// Route to delete a lawyer by ID
router.delete('/:id', authMiddleware.verifyToken, lawyerController.deleteLawyer);

module.exports = router;