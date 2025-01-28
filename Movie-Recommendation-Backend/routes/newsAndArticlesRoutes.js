// routes/newsAndArticlesRoutes.js
const express = require("express");
const {
  getNewsAndUpdates,
  updateNewsAndUpdates,
} = require("../controllers/newsAndArticlesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: News & Updates
 *     description: Management of New and Updates for Movies
 */

/**
 * @swagger
 * /api/news-and-updates:
 *   get:
 *     summary: Get News, Articles, Sequels, and Cast Information
 *     tags: [News & Updates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           example:
 *     responses:
 *       200:
 *         description: Successfully retrieved news, articles, sequels, and cast information
 *       404:
 *         description: No movies found
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getNewsAndUpdates);

/**
 * @swagger
 * /api/news-and-updates:
 *   put:
 *     summary: Update News, Articles, Sequels, and Cast Information
 *     tags: [News & Updates]
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
 *                 example: "673a13b89d66182a4280c45d"
 *               newsAndArticles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "New Sequel Announcement"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-11-17"
 *                     summary:
 *                       type: string
 *                       example: "The latest news about the upcoming sequel."
 *                     link:
 *                       type: string
 *                       example: "https://example.com/new-sequel-news"
 *               sequels:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Movie Sequel"
 *                     releaseYear:
 *                       type: integer
 *                       example: 2025
 *                     synopsis:
 *                       type: string
 *                       example: "The sequel will continue the story..."
 *               cast:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Actor Name"
 *                     biography:
 *                       type: string
 *                       example: "Actor biography goes here..."
 *                     awards:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Best Actor Award 2024"
 *     responses:
 *       200:
 *         description: Successfully updated news, articles, sequels, and cast information
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.put("/", authMiddleware, updateNewsAndUpdates);

module.exports = router;
