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

    if (!courseCode) {
      return res.status(400).json({ message: 'courseCode query parameter is required' });
    }

    const course = await Course.findOne({ courseCode });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
});

// 2. **getCoursesFromProfEmailAPI** (GET /api/courses/getCoursesFromProfEmail)
router.get('/getCoursesFromProfEmail', checkAuthorization, async (req, res) => {
  try {
    const { professorEmail } = req.query;

    if (!professorEmail) {
      return res.status(400).json({ message: 'professorEmail query parameter is required' });
    }

    const courses = await Course.find({ professorEmail });

    if (courses && courses.length > 0) {
      res.status(200).json(courses);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// 3. **createCourseAPI** (POST /api/courses/createCourse)
router.post('/createCourse', checkAuthorization, async (req, res) => {
  try {
    const { courseCode, professorEmail } = req.body;

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

    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
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
