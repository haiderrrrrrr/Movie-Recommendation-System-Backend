const express = require("express");
const {
  getMovieRecommendations,
  getTrendingMovies,
  getTopRatedMovies,
  getSimilarTitles,
} = require("../controllers/recommendationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Movie recommendations based on preferences and activity
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Get personalized movie recommendations for the user
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The ID of the last movie from the previous page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of movies per page (default is 10)
 *     responses:
 *       200:
 *         description: Personalized movie recommendations based on user preferences and collaborative filtering
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "The Dark Knight"
 *                       genre:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: ["Action", "Crime", "Drama"]
 *                       averageRating:
 *                         type: number
 *                         example: 4.8
 *                 personalizedRecommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Inception"
 *                       genre:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: ["Action", "Sci-Fi"]
 *                       averageRating:
 *                         type: number
 *                         example: 4.7
 *                 nextCursor:
 *                   type: string
 *                   example: "64a7e6c987b3e5ad740f985f"
 *       400:
 *         description: User preferences or genres not found
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getMovieRecommendations);

/**
 * @swagger
 * /api/recommendations/trending:
 *   get:
 *     summary: Get the top trending movies based on popularity
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The ID of the last movie from the previous page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of movies per page (default is 10)
 *     responses:
 *       200:
 *         description: List of trending movies with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trendingMovies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "The Dark Knight"
 *                       popularity:
 *                         type: number
 *                         example: 98
 *                 nextCursor:
 *                   type: string
 *                   example: "64a7e6c987b3e5ad740f985f"
 *       404:
 *         description: No trending movies found
 *       500:
 *         description: Server error
 */
router.get("/trending", getTrendingMovies);

/**
 * @swagger
 * /api/recommendations/top-rated:
 *   get:
 *     summary: Get the top-rated movies based on average rating and activity
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The ID of the last movie from the previous page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of movies per page (default is 10)
 *     responses:
 *       200:
 *         description: List of top-rated movies with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topRatedMovies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "The Shawshank Redemption"
 *                       averageRating:
 *                         type: number
 *                         example: 5.0
 *                 nextCursor:
 *                   type: string
 *                   example: "64a7e6c987b3e5ad740f985f"
 *       404:
 *         description: No top-rated movies found
 *       500:
 *         description: Server error
 */
router.get("/top-rated", getTopRatedMovies);

/**
 * @swagger
 * /api/recommendations/similar/{movieId}:
 *   get:
 *     summary: Get similar titles based on genre, director, or popularity
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to find similar titles for
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The ID of the last movie from the previous page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of movies per page (default is 10)
 *     responses:
 *       200:
 *         description: List of similar movies with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 similarMovies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "The Dark Knight"
 *                       genre:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: ["Action", "Crime", "Drama"]
 *                       popularity:
 *                         type: number
 *                         example: 95
 *                 nextCursor:
 *                   type: string
 *                   example: "64a7e6c987b3e5ad740f985f"
 *       404:
 *         description: No similar movies found
 *       500:
 *         description: Server error
 */
router.get("/similar/:movieId", getSimilarTitles);

module.exports = router;
