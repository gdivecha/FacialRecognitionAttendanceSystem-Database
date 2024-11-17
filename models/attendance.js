const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
  },
  timestamp: { 
    type: Date, 
    default: Date.now
  },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
