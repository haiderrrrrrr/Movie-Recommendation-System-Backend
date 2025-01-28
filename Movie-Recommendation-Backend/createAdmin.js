const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config(); // Load environment variables

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MOVIE_DB_URI); // No options needed for latest version
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Create Admin User
const createAdmin = async () => {
  const name = "Admin User"; // Change if needed
  const email = "admin@gmail.com"; // Replace with an actual email
  const username = "admin"; // Change username if needed
  const password = "admin123"; // Replace with a secure password

  try {
    await connectDB();

    // Check if the admin already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.error("Admin creation failed: Email or username already exists");
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const adminUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      isAdmin: true, // Set admin privileges
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
};

// Run the createAdmin function
createAdmin();
