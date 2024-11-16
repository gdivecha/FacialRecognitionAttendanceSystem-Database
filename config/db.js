// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB using the MONGO_URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Server has been connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB;
