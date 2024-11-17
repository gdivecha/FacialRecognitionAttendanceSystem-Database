const mongoose = require('mongoose');
const CourseSchema = require('./course');
const AttendanceSchema = require('./attendance');

const StudentSchema = new mongoose.Schema({
   firstName: {
    type: String,
    required: true,
   },
   lastName: {
    type: String,
    reguired: true,
   },
   studentID: {
    type: String,
    required: true,
    unique: true,
   },
   email: {
    type: String,
    reguired: true,
   },
   courses: {
    type: [CourseSchema],
    required: true,
   },
   faceImages: {
    type: [Image],
    required: true,
   },
   attendance: {
    type: [AttendanceSchema],
    required: true,
   },
});

module.exports = mongoose.model('Student', StudentSchema);
