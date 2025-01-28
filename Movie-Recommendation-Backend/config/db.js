const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MOVIE_DB_URI); // No options needed
    console.log("MongoDB connected successfully...");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process if unable to connect
  }
};

module.exports = connectDB;
