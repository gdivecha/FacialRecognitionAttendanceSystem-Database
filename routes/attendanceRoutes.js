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

router.post('/createAttendanceRecord', checkAuthorization, async (req, res) => {
    try {
      const { courseCode } = req.body;
  
      // Validate that courseCode is provided
      if (!courseCode) {
        return res.status(400).json({ message: 'courseCode is required' });
      }
  
      // Create and save the attendance record
      const newAttendance = new Attendance({ courseCode });
      const savedAttendance = await newAttendance.save();
  
      // Return the ObjectId of the created attendance record
      res.status(201).json({ attendanceId: savedAttendance._id });
    } catch (error) {
      res.status(500).json({ message: 'Error creating attendance', error: error.message });
    }
});

router.get('/getAttendanceTimestamp', checkAuthorization, async (req, res) => {
  try {
    const { attendanceId, courseCode } = req.query;

    // Validate that attendanceId and courseCode are provided
    if (!attendanceId || !courseCode) {
      return res.status(400).json({ message: 'attendanceId and courseCode query parameters are required' });
    }

    // Find the attendance record by ObjectId
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Check if the courseCode matches
    if (attendance.courseCode !== courseCode) {
      return res.status(400).json({ message: 'Course code does not match the attendance record' });
    }

    // Return the timestamp
    res.status(200).json({ timestamp: attendance.timestamp });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance timestamp', error: error.message });
  }
});

module.exports = router;
