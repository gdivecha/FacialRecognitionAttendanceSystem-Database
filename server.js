const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/connect');
const courseRoutes = require('./routes/courseRoutes'); // Import course routes
const professorRoutes = require('./routes/professorRoutes'); // Import professor routes
const attendanceRoutes = require('./routes/attendanceRoutes'); // Import attendance routes
const studentRoutes = require('./routes/studentRoutes'); // Import attendance routes

// Initialize environment variables and database connection
dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Health Check Endpoint
app.get('/', (req, res) => {
    res.send('AITend-Backend API is running');
});

// Route Registrations
app.use('/api/course', courseRoutes); // Course routes
app.use('/api/professor', professorRoutes); // Professor routes
app.use('/api/attendance', attendanceRoutes); // Attendance routes
app.use('/api/student', studentRoutes); // Attendance routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
