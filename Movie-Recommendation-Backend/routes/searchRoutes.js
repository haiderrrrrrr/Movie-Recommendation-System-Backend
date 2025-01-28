const express = require("express");
const {
  searchMovies,
  getTopMoviesByGenre,
  getTopMoviesOfTheMonth,
} = require("../controllers/searchController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search and Filters
 *   description: Search and filtering of movies
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search and filter movies
 *     tags: [Search and Filters]
 *     security:
 *       # Requires JWT Authentication
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, genre, director, or actors
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genres (comma-separated)
 *       - in: query
 *         name: ratingMin
 *         schema:
 *           type: number
 *         description: Minimum average rating
 *       - in: query
 *         name: ratingMax
 *         schema:
 *           type: number
 *         description: Maximum average rating
 *       - in: query
 *         name: popularityMin
 *         schema:
 *           type: number
 *         description: Minimum popularity
 *       - in: query
 *         name: popularityMax
 *         schema:
 *           type: number
 *         description: Maximum popularity
 *       - in: query
 *         name: releaseYear
 *         schema:
 *           type: number
 *         description: Filter by release year
 *       - in: query
 *         name: releaseDecade
 *         schema:
 *           type: number
 *         description: Filter by release decade (e.g., 1990 for 1990s)
 *       - in: query
 *         name: runtimeMin
 *         schema:
 *           type: number
 *         description: Minimum runtime in minutes
 *       - in: query
 *         name: runtimeMax
 *         schema:
 *           type: number
 *         description: Maximum runtime in minutes
 *       - in: query
 *         name: parentalRating
 *         schema:
 *           type: string
 *         description: Filter by parental guidance rating
 *       - in: query
 *         name: actor
 *         schema:
 *           type: string
 *         description: Search by actor's name
 *       - in: query
 *         name: keywords
 *         schema:
 *           type: string
 *         description: Filter by keywords (comma-separated)
 *       - in: query
 *         name: countryOfOrigin
 *         schema:
 *           type: string
 *         description: Filter by country of origin
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: awards
 *         schema:
 *           type: string
 *         description: Filter by awards (comma-separated)
 *       - in: query
 *         name: streamingPlatform
 *         schema:
 *           type: string
 *         description: Filter by available streaming platforms (comma-separated)
 *       - in: query
 *         name: filmingLocation
 *         schema:
 *           type: string
 *         description: Filter by filming locations (comma-separated)
 *       - in: query
 *         name: filmmakingTechnique
 *         schema:
 *           type: string
 *         description: Filter by filmmaking techniques (e.g., IMAX, 3D)
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of movies per page
 *     responses:
 *       200:
 *         description: List of movies based on search and filters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, searchMovies);

/**
 * @swagger
 * /api/search/top-by-genre:
 *   get:
 *     summary: Get top 10 movies by genre
 *     tags: [Search and Filters]
 *     security:
 *       # Requires JWT Authentication
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genres (comma-separated)
 *     responses:
 *       200:
 *         description: List of top 10 movies by genre
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get("/top-by-genre", authMiddleware, getTopMoviesByGenre);

/**
 * @swagger
 * /api/search/top-of-month:
 *   get:
 *     summary: Get top movies of the current month
 *     tags: [Search and Filters]
 *     security:
 *       # Requires JWT Authentication
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top movies of the current month
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get("/top-of-month", authMiddleware, getTopMoviesOfTheMonth);

module.exports = router;
