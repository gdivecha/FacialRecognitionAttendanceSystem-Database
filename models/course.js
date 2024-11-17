const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  professorEmail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
