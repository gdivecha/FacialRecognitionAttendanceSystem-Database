// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User'); // Import the User model

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Route to check if the API is running
app.get('/', (req, res) => {
  res.send('AITend-Backend API is running');
});

// Route to register a new user or add a course to an existing user
app.post('/api/register-user', async (req, res) => {
  try {
    // Extract user details from the request body
    const { userId, name, email, faceImages, course } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ userId });
    if (user) {
      // If the user exists, check if the course is already in the courses array
      if (!user.courses.includes(course)) {
        user.courses.push(course); // Add the new course
        await user.save(); // Save the updated user
        return res.status(200).json({ message: 'Course added to existing user', user });
      }
      return res.status(200).json({ message: 'User already registered for this course', user });
    }

    // If the user does not exist, create a new one
    user = new User({
      userId,
      name,
      email,
      faceImages, // Array of image URLs
      attendance: [], // Initialize with an empty attendance array
      courses: [course], // Add the course to the courses array
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});


// Route to record attendance for a user
app.post('/api/users/:userId/attendance', async (req, res) => {
  const { userId } = req.params;
  try {
    // Find the user by their userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add a new attendance record with the current date
    user.attendance.push({ status: 'present', date: new Date() });
    await user.save(); // Save the updated user

    res.status(201).json({ message: 'Attendance recorded', attendance: user.attendance });
  } catch (error) {
    res.status(500).json({ error: 'Error recording attendance' });
  }
});
// Route to get attendance for a specific date for a specific user
app.get('/api/users/:userId/attendance/:date', async (req, res) => {
  const { userId, date } = req.params;
  try {
    // Find the user by their userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Parse the provided date and set the time to 00:00:00 in UTC
    const requestedDate = new Date(date);
    requestedDate.setUTCHours(0, 0, 0, 0);

    // Check if there is an attendance record for the requested date
    const specificDateAttendance = user.attendance.find((record) => {
      const recordDate = new Date(record.date);
      recordDate.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00 in UTC
      return recordDate.getTime() === requestedDate.getTime();
    });

    if (!specificDateAttendance) {
      return res.status(404).json({ message: 'No attendance recorded for this date' });
    }

    res.status(200).json({ message: 'Attendance found', specificDateAttendance });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving attendance' });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
