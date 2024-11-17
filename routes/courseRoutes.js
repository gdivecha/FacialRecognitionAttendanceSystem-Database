const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// Middleware to check authorization
const checkAuthorization = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// 1. **getCourseFromCourseCodeAPI** (GET /api/courses/getCourseFromCourseCode)
router.get('/getCourseFromCourseCode', checkAuthorization, async (req, res) => {
    try {
      const { courseCode } = req.query;
  
      // Validate query parameter
      if (!courseCode) {
        return res.status(400).json({ message: 'courseCode query parameter is required' });
      }
  
      // Find the course by courseCode
      const course = await Course.findOne({ courseCode });
  
      // Return the course ObjectId or null
      if (course) {
        res.status(200).json({ courseId: course._id });
      } else {
        res.status(200).json({ courseId: null });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
});

// 2. **getCoursesFromProfEmailAPI** (GET /api/courses/getCoursesFromProfEmail)
router.get('/getCoursesFromProfEmail', checkAuthorization, async (req, res) => {
    try {
      const { professorEmail } = req.query;
  
      // Validate query parameter
      if (!professorEmail) {
        return res.status(400).json({ message: 'professorEmail query parameter is required' });
      }
  
      // Find all courses taught by the professor
      const courses = await Course.find({ professorEmail }, '_id'); // Fetch only the ObjectId (_id) field
  
      // Extract the ObjectId array
      const courseIds = courses.map((course) => course._id);
  
      // Return the array of ObjectIds
      res.status(200).json(courseIds);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

// 3. **createCourseAPI** (POST /api/courses/createCourse)
router.post('/createCourse', checkAuthorization, async (req, res) => {
    try {
      const { courseCode, professorEmail } = req.body;
  
      // Validate request body
      if (!courseCode || !professorEmail) {
        return res.status(400).json({ message: 'courseCode and professorEmail are required' });
      }
  
      // Check if the course already exists
      const existingCourse = await Course.findOne({ courseCode });
      if (existingCourse) {
        return res.status(400).json({ message: 'Course with this code already exists' });
      }
  
      // Create and save the new course
      const newCourse = new Course({ courseCode, professorEmail });
      const savedCourse = await newCourse.save();
  
      // Return the ObjectId of the created course
      res.status(201).json({ courseId: savedCourse._id });
    } catch (error) {
      // Return null in case of an error
      res.status(500).json({ message: 'Error creating course', error: error.message, courseId: null });
    }
});

// 4. **deleteCourseAPI** (DELETE /api/courses/deleteCourse)
router.delete('/deleteCourse', checkAuthorization, async (req, res) => {
  try {
    const { courseCode } = req.query;

    if (!courseCode) {
      return res.status(400).json({ message: 'courseCode query parameter is required' });
    }

    const deletedCourse = await Course.findOneAndDelete({ courseCode });

    if (deletedCourse) {
      res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

module.exports = router;
