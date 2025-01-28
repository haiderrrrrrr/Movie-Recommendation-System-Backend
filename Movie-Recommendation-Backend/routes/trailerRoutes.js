const express = require("express");
const {
  createTrailer,
  getTrailers,
  getTrailerById, // Added this
  updateTrailer,
  deleteTrailer,
  shareTrailer,
} = require("../controllers/trailerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Trailer
 *     description: Management of Upcoming Trailer for New Movies
 */

/**
 * @swagger
 * /api/trailers:
 *   post:
 *     summary: Create a new trailer (Admin Only)
 *     tags: [Trailer]
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
 *                 example: "60c72b2f9f1b2c001f1e8f22"
 *               trailerName:
 *                 type: string
 *                 example: "Thrilling Adventure Trailer"
 *               trailerUrl:
 *                 type: string
 *                 example: "https://www.example.com/trailer.mp4"
 *               trailerType:
 *                 type: string
 *                 example: "Official"
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-15"
 *               duration:
 *                 type: integer
 *                 example: 180
 *               description:
 *                 type: string
 *                 example: "An Awesome thrilling adventure that takes you on a wild journey."
 *               language:
 *                 type: string
 *                 example: "English"
 *               regionRestrictions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["US", "CA"]
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Trailer created successfully
 *       400:
 *         description: Invalid input or missing required fields
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, createTrailer);

/**
 * @swagger
 * /api/trailers:
 *   get:
 *     summary: Get all trailers
 *     tags: [Trailer]
 *     parameters:
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: cursor
 *         type: string
 *         description: Cursor for pagination
 *         example:
 *     responses:
 *       200:
 *         description: A list of trailers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   trailerId:
 *                     type: string
 *                     example: "60c72b2f9f1b2c001f1e8f22"
 *                   movieId:
 *                     type: string
 *                     example: "60c72b2f9f1b2c001f1e8f22"
 *                   trailerName:
 *                     type: string
 *                     example: "Thrilling Adventure Trailer"
 *                   trailerUrl:
 *                     type: string
 *                     example: "https://www.example.com/trailer.mp4"
 *                   trailerType:
 *                     type: string
 *                     example: "Official"
 *                   releaseDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-12-15"
 *                   duration:
 *                     type: integer
 *                     example: 180
 *                   description:
 *                     type: string
 *                     example: "A thrilling adventure that takes you on a wild journey."
 *                   language:
 *                     type: string
 *                     example: "English"
 *                   regionRestrictions:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["US", "CA"]
 *                   isPublic:
 *                     type: boolean
 *                     example: true
 *       404:
 *         description: No trailers found
 *       500:
 *         description: Server error
 */
router.get("/", getTrailers);

/**
 * @swagger
 * /api/trailers/{id}:
 *   get:
 *     summary: Get a trailer by ID
 *     tags: [Trailer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trailer ID
 *         schema:
 *           type: string
 *         example: "673c1598a81f3e3348dee7fd"
 *     responses:
 *       200:
 *         description: Trailer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trailerId:
 *                   type: string
 *                   example: "60c72b2f9f1b2c001f1e8f22"
 *                 movieId:
 *                   type: string
 *                   example: "60c72b2f9f1b2c001f1e8f22"
 *                 trailerName:
 *                   type: string
 *                   example: "Thrilling Adventure Trailer"
 *                 trailerUrl:
 *                   type: string
 *                   example: "https://www.example.com/trailer.mp4"
 *                 trailerType:
 *                   type: string
 *                   example: "Official"
 *                 releaseDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-12-15"
 *                 duration:
 *                   type: integer
 *                   example: 180
 *                 description:
 *                   type: string
 *                   example: "A thrilling adventure that takes you on a wild journey."
 *                 language:
 *                   type: string
 *                   example: "English"
 *                 regionRestrictions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["US", "CA"]
 *                 isPublic:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Trailer not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getTrailerById); // Added this route

/**
 * @swagger
 * /api/trailers/{id}:
 *   put:
 *     summary: Update an existing trailer (Admin Only)
 *     tags: [Trailer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trailer ID
 *         schema:
 *           type: string
 *         example: "673c1598a81f3e3348dee7fd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trailerName:
 *                 type: string
 *                 example: "Updated Adventure Trailer"
 *               trailerUrl:
 *                 type: string
 *                 example: "https://www.example.com/trailer_updated.mp4"
 *               trailerType:
 *                 type: string
 *                 example: "Teaser"
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-18"
 *               duration:
 *                 type: integer
 *                 example: 120
 *               description:
 *                 type: string
 *                 example: "An updated look at the thrilling adventure."
 *               language:
 *                 type: string
 *                 example: "French"
 *               regionRestrictions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["US", "UK"]
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Trailer updated successfully
 *       404:
 *         description: Trailer not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, updateTrailer);

/**
 * @swagger
 * /api/trailers/{id}:
 *   delete:
 *     summary: Delete a trailer (Admin Only)
 *     tags: [Trailer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trailer ID
 *         schema:
 *           type: string
 *         example: "673c1598a81f3e3348dee7fd"
 *     responses:
 *       200:
 *         description: Trailer deleted successfully
 *       404:
 *         description: Trailer not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteTrailer);

/**
 * @swagger
 * /api/trailers/share:
 *   post:
 *     summary: Share a trailer via email, WhatsApp, and SMS
 *     tags: [Trailer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trailerId:
 *                 type: string
 *                 example: "673c1588a81f3e3348dee7fa"
 *               email:
 *                 type: string
 *                 example: "testingprojectmail2024@gmail.com"
 *               whatsapp:
 *                 type: string
 *                 example: "+923035120027"
 *               sms:
 *                 type: string
 *                 example: "+923321606103"
 *               message:
 *                 type: string
 *                 example: "Check out this amazing trailer!"
 *     responses:
 *       200:
 *         description: Trailer shared successfully via email, WhatsApp, and SMS
 *       404:
 *         description: Trailer not found
 *       500:
 *         description: Error sharing trailer
 */
router.post("/share", shareTrailer);

module.exports = router;
