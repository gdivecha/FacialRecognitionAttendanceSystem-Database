const mongoose = require('mongoose');

// Define the schema for a single face image
const FaceImageSchema = new mongoose.Schema({
  imageUrl: String, // URL or path to the stored image
  uploadedAt: { type: Date, default: Date.now }, // Timestamp of when the image was uploaded
});

// Define the schema for attendance tracking
const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // Date of attendance
  status: { type: String, enum: ['present', 'absent'], default: 'present' }, // Attendance status
});

// Define the user schema
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User's unique identifier
  name: { type: String, required: true }, // User's name
  email: { type: String, required: true }, // User's email
  faceImages: [FaceImageSchema], // Array to store multiple face images
  attendance: [AttendanceSchema], // Array to store attendance records
  courses: { type: [String], default: [] }, // Array to store enrolled courses
});

module.exports = mongoose.model('User', UserSchema);
