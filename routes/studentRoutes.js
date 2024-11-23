const express = require('express');
const multer = require('multer');
const router = express.Router();
const mongoose = require('mongoose');
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

router.get('/getStudentInformation', checkAuthorization, async (req, res) => {
  try {
    const { studentObjectID } = req.query;

    // Validate that studentObjectID is provided
    if (!studentObjectID) {
      return res.status(400).json({
        message: 'studentObjectID query parameter is required',
      });
    }

    // Find the student by studentObjectID and include the courses array
    const student = await Student.findById(studentObjectID).select(
      'firstName lastName email studentID courses'
    );

    // Return the result
    if (student) {
      res.status(200).json({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentID: student.studentID,
        courses: student.courses, // Directly return the array of course Object IDs
      });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student information', error: error.message });
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


// Configure Multer for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload multiple face images for a student
router.put('/uploadStudentFaceImages', checkAuthorization, upload.array('images', 10), async (req, res) => {
    try {
      const { studentID } = req.body; // Get studentID from the request
      const files = req.files; // Get uploaded files
  
      // Validate inputs
      if (!studentID || !files || files.length === 0) {
        return res.status(400).json({ message: 'studentID and images are required' });
      }
  
      // Find the student by their studentID
      const student = await Student.findOne({ studentID });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Add each uploaded image to the faceImages array
      files.forEach((file) => {
        student.faceImages.push({
          _id: new mongoose.Types.ObjectId(), // Explicitly create an ObjectId for each image
          data: file.buffer,
          contentType: file.mimetype,
        });
      });
  
      // Save the updated student document
      await student.save();
  
      res.status(200).json({
        message: `${files.length} images uploaded successfully`,
        studentId: student.studentID,
        addedImages: student.faceImages.slice(-files.length), // Return details of the newly added images
      });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading images', error: error.message });
    }
});

router.get('/getStudentImages', checkAuthorization, async (req, res) => {
    try {
        const { studentID } = req.query; // Get the student ID from query params
  
        // Validate the input
        if (!studentID) {
            return res.status(400).json({ message: 'studentID is required' });
        }

        // Find the student by their studentID (ensure trimmed and case-insensitive)
        const student = await Student.findOne({ studentID: studentID.trim() });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Convert the images into base64 format
        const images = student.faceImages.map((image) => ({
            _id: image._id, // Include the unique image ID for frontend reference
            data: `data:${image.contentType};base64,${image.data.toString('base64')}`, // Convert binary data to base64
            contentType: image.contentType, // Include MIME type
        }));

        // Send the images in the response
        res.status(200).json({
            message: `${images.length} images retrieved successfully`,
            images,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching images', error: error.message });
    }
});

router.delete('/deleteStudentImage', checkAuthorization, async (req, res) => {
    try {
      const { studentID, imageID } = req.query; // Get student ID and image ID from query params
  
      // Validate inputs
      if (!studentID || !imageID) {
        return res.status(400).json({ message: 'studentID and imageID are required' });
      }
  
      // Find the student by their studentID
      const student = await Student.findOne({ studentID });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Find and remove the image by its ID
      const initialLength = student.faceImages.length;
      student.faceImages = student.faceImages.filter(
        (image) => image._id.toString() !== imageID
      );
  
      // Check if the image was removed
      if (student.faceImages.length === initialLength) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      // Save the updated student document
      await student.save();
  
      res.status(200).json({
        message: `Image with ID ${imageID} deleted successfully`,
        studentId: student.studentID,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting image', error: error.message });
    }
});

module.exports = router;
