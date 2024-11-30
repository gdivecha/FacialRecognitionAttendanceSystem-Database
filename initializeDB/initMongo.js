const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const connectDB = require('../db/connect');
const dotenv = require('dotenv');

const CourseSchema = require("../models/course");
const ProfessorSchema = require("../models/professor");
const StudentSchema = require("../models/student");
const AttendanceSchema = require("../models/attendance");

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/AITend";

async function preloadData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for data initialization.");

    // Define Models
    const Course = CourseSchema;
    const Professor = ProfessorSchema;
    const Student = StudentSchema;
    const Attendance = AttendanceSchema;

    // Clear existing data
    await Course.deleteMany({});
    await Professor.deleteMany({});
    await Student.deleteMany({});
    await Attendance.deleteMany({});

    // Insert Professors
    const professors = [
      { firstName: "Sample", lastName: "Professor 1", email: "sample.professor1@torontomu.ca" },
      { firstName: "Sample", lastName: "Professor 2", email: "sample.professor2@torontomu.ca" },
    ];
    const professorDocs = await Professor.insertMany(professors);

    // Insert Courses
    const courses = [
      { courseCode: "CPS209", professorEmail: "sample.professor1@torontomu.ca" },
      { courseCode: "CPS511", professorEmail: "sample.professor1@torontomu.ca" },
      { courseCode: "CPS706", professorEmail: "sample.professor1@torontomu.ca" },
      { courseCode: "CPS813", professorEmail: "sample.professor1@torontomu.ca" },
      { courseCode: "CPS721", professorEmail: "sample.professor1@torontomu.ca" },
      { courseCode: "CPS899", professorEmail: "sample.professor2@torontomu.ca" },
      { courseCode: "ELE888", professorEmail: "sample.professor2@torontomu.ca" },
    ];
    const courseDocs = await Course.insertMany(courses);

    // Create a map of course codes to ObjectIds for easy lookup
    const courseMap = courseDocs.reduce((map, course) => {
      map[course.courseCode] = course._id;
      return map;
    }, {});

    // Insert Students with courses
    const students = [
      {
        firstName: "Gaurav",
        lastName: "Divecha",
        studentID: "501034331",
        email: "gdivecha@torontomu.ca",
        courses: [courseMap["CPS721"]],
      },
      {
        firstName: "Mohammad",
        lastName: "Al-Shalabi",
        studentID: "501034332",
        email: "malshalabi@torontomu.ca",
        courses: [courseMap["CPS209"]],
      },
      {
        firstName: "Jessica",
        lastName: "Singh",
        studentID: "500967855",
        email: "j16singh@torontomu.ca",
        courses: [courseMap["CPS511"]],
      },
      {
        firstName: "Wasay",
        lastName: "Adil",
        studentID: "501112339",
        email: "wasay.adil@torontomu.ca",
        courses: [courseMap["CPS706"]],
      },
      {
        firstName: "Feroz",
        lastName: "Naeem",
        studentID: "501037700",
        email: "f1naeem@torontomu.ca",
        courses: [courseMap["CPS813"], courseMap["ELE888"], courseMap["CPS706"]],
      },
    ];
    const studentDocs = await Student.insertMany(students);

    // Insert Attendance Records for each student and their courses
    for (const student of studentDocs) {
      const attendanceRecords = student.courses.map((courseId) => ({
        courseCode: courseDocs.find((course) => course._id.equals(courseId)).courseCode,
        timestamp: new Date(),
      }));

      const attendanceDocs = await Attendance.insertMany(attendanceRecords);

      // Update the student's attendance array with the new Attendance object IDs
      student.attendance = attendanceDocs.map((attendance) => attendance._id);

      const faceImages = [];
      for (let i = 1; i <= 5; i++) {
        const imagePath = path.join(__dirname, `faceImages/${student.studentID}_image${i}.jpeg`);
        if (fs.existsSync(imagePath)) {
            const imageData = fs.readFileSync(imagePath);
            faceImages.push({ data: imageData, contentType: "image/jpeg" });
        } else {
            console.warn(`Warning: Image file not found at ${imagePath}`);
        }
      }

    student.faceImages = faceImages;

      await student.save();
    }

    console.log("Data preloaded successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error preloading data:", error);
    process.exit(1);
  }
}

dotenv.config();
connectDB();
preloadData();