const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateWishlist, // Include the new updateWishlist function
  createUserProfile, // Ensure createUserProfile is imported if you added that
  updateSignupDetails,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Haider Ali
 *               email:
 *                 type: string
 *                 example: haideerch6072@gmail.com
 *               username:
 *                 type: string
 *                 example: haider
 *               password:
 *                 type: string
 *                 example: Haider123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *                 example: zara
 *               password:
 *                 type: string
 *                 example: zara123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/update-signup-details:
 *   put:
 *     summary: Update signup details (name, email, username, password)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 example: updated.email@example.com
 *               username:
 *                 type: string
 *                 example: updatedUsername
 *               password:
 *                 type: string
 *                 example: UpdatedPassword123!
 *     responses:
 *       200:
 *         description: Signup details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signup details updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64a85f5bd9d9c2a1c0e9b4e3"
 *                     name:
 *                       type: string
 *                       example: Updated Name
 *                     email:
 *                       type: string
 *                       example: updated.email@example.com
 *                     username:
 *                       type: string
 *                       example: updatedUsername
 *       400:
 *         description: Validation error or field already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/update-signup-details", authMiddleware, updateSignupDetails);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/profile", authMiddleware, getUserProfile);

/**
 * @swagger
 * /api/users/create-profile:
 *   post:
 *     summary: Create user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *                 properties:
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Action", "Comedy", "Drama"]
 *                   actors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Leonardo DiCaprio", "Tom Hardy"]
 *     responses:
 *       200:
 *         description: User profile preferences updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/create-profile", authMiddleware, createUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Zaru
 *               preferences:
 *                 type: object
 *                 properties:
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Action", "Comedy", "Drama"]
 *                   actors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Leonardo DiCaprio", "Tom Hardy"]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/profile", authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Delete user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/profile", authMiddleware, deleteUserProfile);

/**
 * @swagger
 * /api/users/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/wishlist", authMiddleware, getWishlist);

/**
 * @swagger
 * /api/users/wishlist:
 *   post:
 *     summary: Add a movie to the wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: 673a17fbb9e0caff9a6d94e3
 *     responses:
 *       200:
 *         description: Movie added to wishlist successfully
 *       400:
 *         description: Validation error (missing movieId)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/wishlist", authMiddleware, addToWishlist);

/**
 * @swagger
 * /api/users/wishlist/remove:
 *   post:
 *     summary: Remove a movie from the wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: 673a17fbb9e0caff9a6d94e3
 *     responses:
 *       200:
 *         description: Movie removed from wishlist successfully
 *       400:
 *         description: Validation error (missing movieId)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/wishlist/remove", authMiddleware, removeFromWishlist);

/**
 * @swagger
 * /api/users/wishlist/update:
 *   post:
 *     summary: Update movie in wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: 673a16e5b9e0caff9a6d9496
 *               action:
 *                 type: string
 *                 enum: [add, remove]
 *                 example: add
 *     responses:
 *       200:
 *         description: Wishlist updated successfully
 *       400:
 *         description: Validation error (missing movieId or invalid action)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/wishlist/update", authMiddleware, updateWishlist);

module.exports = router;
