const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // Reference to Course model
    },
  ],
  faceImages: [
    {
      data: Buffer, // Optional binary data for images
      contentType: String, // Optional MIME type (e.g., "image/png")
    },
  ],
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance', // Reference to Attendance model
    },
  ],
});

module.exports = mongoose.model('Student', StudentSchema);
