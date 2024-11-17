const express = require('express');
const router = express.Router();
const Student = require('../models/student'); // Import the Student model

// Middleware to check authorization
const checkAuthorization = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// **getStudentAPI**: Fetch a student by studentID
router.get('/getStudent', checkAuthorization, async (req, res) => {
  try {
    const { studentID } = req.query;

    // Validate that studentID is provided
    if (!studentID) {
      return res.status(400).json({ message: 'studentID query parameter is required' });
    }

    // Find the student by studentID
    const student = await Student.findOne({ studentID });

    // Return the ObjectId or null
    if (student) {
      res.status(200).json({ studentId: student._id });
    } else {
      res.status(200).json({ studentId: null });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

// **createStudentAPI**: Create a new student
router.post('/createStudent', checkAuthorization, async (req, res) => {
    try {
      const { firstName, lastName, email, studentID, courseObjectId } = req.body;
  
      // Validate request data
      if (!firstName || !lastName || !email || !studentID || !courseObjectId) {
        return res.status(400).json({
          message: 'firstName, lastName, email, studentID, and courseObjectId are required',
        });
      }
  
      // Check if the student already exists
      const existingStudent = await Student.findOne({ studentID });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student with this studentID already exists' });
      }
  
      // Create a new student object
      const newStudent = new Student({
        firstName,
        lastName,
        email,
        studentID,
        courses: [courseObjectId], // Singleton array with the course ObjectId
        faceImages: [], // Initialize as empty array
        attendance: [], // Initialize as empty array
      });
  
      // Save the new student to the database
      const savedStudent = await newStudent.save();
  
      // Return only the ObjectId of the created student
      res.status(201).json({ studentId: savedStudent._id });
    } catch (error) {
      res.status(500).json({ message: 'Error creating student', error: error.message });
    }
});  

// **enrollStudentToCourseAPI**: Add a course to a student's courses array
router.put('/enrollStudentToCourse', checkAuthorization, async (req, res) => {
    try {
      const { studentObjectId, courseObjectId } = req.body;
  
      // Validate input data
      if (!studentObjectId || !courseObjectId) {
        return res.status(400).json({ message: 'studentObjectId and courseObjectId are required' });
      }
  
      // Find the student by ID
      const student = await Student.findById(studentObjectId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Check if the course is already in the student's courses array
      if (student.courses.includes(courseObjectId)) {
        return res.status(400).json({ message: 'Student is already enrolled in this course' });
      }
  
      // Add the courseObjectId to the student's courses array
      student.courses.push(courseObjectId);
  
      // Save the updated student
      await student.save();
  
      // Return success response
      res.status(200).json({ message: 'Course successfully added to student' });
    } catch (error) {
      res.status(500).json({ message: 'Error enrolling student to course', error: error.message });
    }
});

// **searchStudentsCoursesAPI**: Check if a course exists in a student's courses array
router.get('/isStudentEnrolledInCourse', checkAuthorization, async (req, res) => {
    try {
      const { studentObjectId, courseObjectId } = req.query;
  
      // Validate query parameters
      if (!studentObjectId || !courseObjectId) {
        return res.status(400).json({
          message: 'studentObjectId and courseObjectId query parameters are required',
        });
      }
  
      // Find the student by their ObjectId
      const student = await Student.findById(studentObjectId);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Check if the courseObjectId exists in the student's courses array
      const studentHasCourse = student.courses.includes(courseObjectId);
  
      // Return the result as a boolean
      res.status(200).json({ studentHasCourse });
    } catch (error) {
      res.status(500).json({ message: 'Error searching student courses', error: error.message });
    }
});

// **unenrollStudentFromCourseAPI**: Remove a course from a student's courses array
router.put('/unenrollStudentFromCourse', checkAuthorization, async (req, res) => {
    try {
      const { studentObjectId, courseObjectId } = req.body;
  
      // Validate input data
      if (!studentObjectId || !courseObjectId) {
        return res.status(400).json({ message: 'studentObjectId and courseObjectId are required' });
      }
  
      // Find the student by ID
      const student = await Student.findById(studentObjectId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Check if the course is in the student's courses array
      if (!student.courses.includes(courseObjectId)) {
        return res.status(400).json({ message: 'Course is not enrolled by the student' });
      }
  
      // Remove the courseObjectId from the student's courses array
      student.courses = student.courses.filter((courseId) => courseId.toString() !== courseObjectId);
  
      // Save the updated student
      await student.save();
  
      // Return success response
      res.status(200).json({ message: 'Course successfully removed from student' });
    } catch (error) {
      res.status(500).json({ message: 'Error unenrolling student from course', error: error.message });
    }
});

// **deleteStudentAPI**: Delete a student permanently based on their studentID
router.delete('/deleteStudent', checkAuthorization, async (req, res) => {
    try {
      const { studentID } = req.query;
  
      // Validate input
      if (!studentID) {
        return res.status(400).json({ message: 'studentID query parameter is required' });
      }
  
      // Find and delete the student by their studentID
      const deletedStudent = await Student.findOneAndDelete({ studentID });
  
      if (deletedStudent) {
        res.status(200).json({ message: 'Student deleted successfully' });
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
});

// **getStudentsEnrolledInCourseAPI**: Get all students enrolled in a specific course
router.get('/getStudentsEnrolledInCourse', checkAuthorization, async (req, res) => {
    try {
      const { courseObjectId } = req.query;
  
      // Validate input
      if (!courseObjectId) {
        return res.status(400).json({ message: 'courseObjectId query parameter is required' });
      }
  
      // Find students with the specified courseObjectId in their courses array
      const students = await Student.find({ courses: courseObjectId }, '_id'); // Fetch only student IDs
  
      // Extract student IDs into an array
      const studentIds = students.map((student) => student._id);
  
      // Return the array of student IDs
      res.status(200).json(studentIds);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students enrolled in the course', error: error.message });
    }
});

router.get('/getStudentFaceImages', checkAuthorization, async (req, res) => {
    try {
      const { studentObjectId } = req.query;
  
      // Validate input
      if (!studentObjectId) {
        return res.status(400).json({ message: 'studentObjectId query parameter is required' });
      }
  
      // Find the student by their ObjectId
      const student = await Student.findById(studentObjectId);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Return the faceImages array
      res.status(200).json(student.faceImages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching face images', error: error.message });
    }
});
  
// **attachStudentAttendanceRecordAPI**
router.put('/attachAttendanceToStudent', checkAuthorization, async (req, res) => {
    try {
      const { studentId, attendanceId } = req.body;
  
      // Validate inputs
      if (!studentId || !attendanceId) {
        return res.status(400).json({
          message: 'Both studentId and attendanceId are required',
        });
      }
  
      // Find the student by their ObjectId
      const student = await Student.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Add the Attendance Object ID to the attendance array if it's not already present
      if (!student.attendance.includes(attendanceId)) {
        student.attendance.push(attendanceId);
        await student.save();
      }
  
      // Return success response with updated student object
      res.status(200).json({
        message: 'Attendance record successfully attached to student',
        updatedStudent: student,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error attaching attendance record to student',
        error: error.message,
      });
    }
});

module.exports = router;
