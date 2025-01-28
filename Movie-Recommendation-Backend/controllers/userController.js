const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator"); // Importing the validator package for email validation

// Register User
const registerUser = async (req, res) => {
  const { name, email, username, password } = req.body;

  // Input validation
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Password validation: Must be at least 6 characters, and at least one number, one uppercase letter, and one special character.
  const passwordValidationRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordValidationRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters long, include at least one letter, one number, and one special character",
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  // Input validation
  if (!emailOrUsername || !password) {
    return res
      .status(400)
      .json({ error: "Email/Username and password are required" });
  }

  // Password validation: Minimum length check
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Signup Details
const updateSignupDetails = async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name && !email && !username && !password) {
    return res
      .status(400)
      .json({ error: "At least one field must be updated" });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const passwordValidationRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (password && !passwordValidationRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters long, include at least one letter, one number, and one special character",
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (email && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const existingUserWithUsername = await User.findOne({ username });
      if (existingUserWithUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      user.username = username;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.name = name || user.name;
    await user.save();

    res
      .status(200)
      .json({ message: "Signup details updated successfully", user });
  } catch (error) {
    console.error("Error updating signup details:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Profile
const updateUserProfile = async (req, res) => {
  const { name, preferences } = req.body;

  if (!name && !preferences) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.preferences = preferences || user.preferences;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Create Profile
const createUserProfile = async (req, res) => {
  const { preferences } = req.body;

  if (!preferences) {
    return res.status(400).json({ error: "Preferences are required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.preferences = preferences || user.preferences;
    await user.save();

    res.status(200).json({ message: "Profile created successfully", user });
  } catch (error) {
    console.error("Error creating profile:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Profile
const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Add to Wishlist
const addToWishlist = async (req, res) => {
  const { movieId } = req.body;

  if (!movieId) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.wishlist.includes(movieId)) {
      return res.status(400).json({ error: "Movie already in wishlist" });
    }

    user.wishlist.push(movieId);
    await user.save();

    res
      .status(200)
      .json({ message: "Movie added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error adding movie to wishlist:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  const { movieId } = req.body;

  if (!movieId) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.wishlist.includes(movieId)) {
      return res.status(400).json({ error: "Movie not found in wishlist" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== movieId);
    await user.save();

    res.status(200).json({
      message: "Movie removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error removing movie from wishlist:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Wishlist
const updateWishlist = async (req, res) => {
  const { movieId, action } = req.body;

  if (!movieId || !action) {
    return res.status(400).json({ error: "Movie ID and action are required" });
  }

  if (!["add", "remove"].includes(action)) {
    return res
      .status(400)
      .json({ error: "Invalid action. Use 'add' or 'remove'" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (action === "add") {
      if (user.wishlist.includes(movieId)) {
        return res.status(400).json({ error: "Movie already in wishlist" });
      }
      user.wishlist.push(movieId);
    } else if (action === "remove") {
      if (!user.wishlist.includes(movieId)) {
        return res.status(400).json({ error: "Movie not found in wishlist" });
      }
      user.wishlist = user.wishlist.filter((id) => id.toString() !== movieId);
    }

    await user.save();

    res.status(200).json({
      message: "Wishlist updated successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error updating wishlist:", error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateWishlist,
  createUserProfile,
  updateSignupDetails,
};
