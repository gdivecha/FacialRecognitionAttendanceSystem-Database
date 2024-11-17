const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance'); // Import the Attendance model

// Middleware to check authorization
const checkAuthorization = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// 1. **Create Attendance** (POST /api/attendance)
router.post('/', checkAuthorization, async (req, res) => {
  try {
    const { courseCode } = req.body;

    // Validate that courseCode is provided
    if (!courseCode) {
      return res.status(400).json({ message: 'courseCode is required' });
    }

    // Create and save the attendance record
    const newAttendance = new Attendance({ courseCode });
    const savedAttendance = await newAttendance.save();

    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Error creating attendance', error: error.message });
  }
});

module.exports = router;
