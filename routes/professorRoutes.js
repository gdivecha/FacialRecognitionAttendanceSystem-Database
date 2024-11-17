const express = require('express');
const router = express.Router();
const Professor = require('../models/professor'); // Import the Professor model

// Middleware to check authorization
const checkAuthorization = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// 1. **Create a New Professor** (POST /api/professor/createProfessor)
router.post('/createProfessor', checkAuthorization, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    // Validate request data
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'firstName, lastName, and email are required' });
    }

    // Check if the professor already exists
    const existingProfessor = await Professor.findOne({ email });
    if (existingProfessor) {
      return res.status(400).json({ message: 'Professor with this email already exists' });
    }

    // Create and save the new professor
    const newProfessor = new Professor({ firstName, lastName, email });
    const savedProfessor = await newProfessor.save();

    res.status(201).json(savedProfessor); // Respond with the created professor
  } catch (error) {
    res.status(500).json({ message: 'Error creating professor', error: error.message });
  }
});

// 3. **Get a Specific Professor by Email** (GET /api/professors?email={email})
router.get('/getProfessor', checkAuthorization, async (req, res) => {
  try {
    const { email } = req.query;

    // If email is provided, fetch specific professor
    if (email) {
      const professor = await Professor.findOne({ email });
      if (professor) {
        return res.status(200).json(professor);
      } else {
        return res.status(404).json({ message: 'Professor not found' });
      }
    }

    // If no email is provided, return all professors
    const professors = await Professor.find();
    res.status(200).json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professors', error: error.message });
  }
});

// 2. **Get All Professors** (GET /api/professors)
router.get('/getAllProfessors', checkAuthorization, async (req, res) => {
    try {
      const professors = await Professor.find(); // Fetch all professors
      res.status(200).json(professors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching professors', error: error.message });
    }
  });

// 4. **Delete a Professor by Email** (DELETE /api/professor/deleteProfessor?email={email})
router.delete('/deleteProfessor', checkAuthorization, async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'email query parameter is required' });
    }

    const deletedProfessor = await Professor.findOneAndDelete({ email });
    if (deletedProfessor) {
      res.status(200).json({ message: 'Professor deleted successfully', deletedProfessor });
    } else {
      res.status(404).json({ message: 'Professor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting professor', error: error.message });
  }
});

module.exports = router;
