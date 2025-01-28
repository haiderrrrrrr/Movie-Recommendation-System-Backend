const express = require("express");
const {
  getMostPopularMovies,
  getTrendingGenres,
  getMostSearchedActors,
  getUserEngagementPatterns,
  getTopRatedMoviesByGenre,
  getMoviesByYearRange,
  getTopBoxOfficeMovies,
  getMoviesByDirector,
  getMostDiscussedMovies,
} = require("../controllers/adminStatsController");
const authMiddleware = require("../middleware/authMiddleware");
const checkAdminAccess = require("../middleware/checkAdminAccess");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminStats
 *   description: Viewing site statistics and admin insights
 */

/**
 * @swagger
 * /api/admin-stats/popular-movies:
 *   get:
 *     summary: Get the most popular movies (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: >
 *           Maximum number of records to return.
 *           Defaults to 10.
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           example:
 *         description: >
 *           Cursor for pagination.
 *           This is the ID of the last record from the previous page.
 *     responses:
 *       200:
 *         description: Most popular movies retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/popular-movies",
  authMiddleware,
  checkAdminAccess,
  getMostPopularMovies
);

/**
 * @swagger
 * /api/admin-stats/trending-genres:
 *   get:
 *     summary: Get trending genres (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: >
 *           Maximum number of records to return.
 *           Defaults to 10.
 *     responses:
 *       200:
 *         description: Trending genres retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/trending-genres",
  authMiddleware,
  checkAdminAccess,
  getTrendingGenres
);

/**
 * @swagger
 * /api/admin-stats/most-searched-actors:
 *   get:
 *     summary: Get the most searched actors (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: >
 *           Maximum number of records to return.
 *           Defaults to 10.
 *     responses:
 *       200:
 *         description: Most searched actors retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/most-searched-actors",
  authMiddleware,
  checkAdminAccess,
  getMostSearchedActors
);

/**
 * @swagger
 * /api/admin-stats/user-engagement:
 *   get:
 *     summary: Get user engagement patterns (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: >
 *           Maximum number of records to return.
 *           Defaults to 10.
 *     responses:
 *       200:
 *         description: User engagement patterns retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/user-engagement",
  authMiddleware,
  checkAdminAccess,
  getUserEngagementPatterns
);

/**
 * @swagger
 * /api/admin-stats/top-rated-movies:
 *   get:
 *     summary: Get top-rated movies by genre (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *           example: "Action"
 *         description: Genre to filter by.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: >
 *           Maximum number of records to return.
 *           Defaults to 10.
 *     responses:
 *       200:
 *         description: Top-rated movies by genre retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/top-rated-movies",
  authMiddleware,
  checkAdminAccess,
  getTopRatedMoviesByGenre
);

/**
 * @swagger
 * /api/admin-stats/movies-by-year:
 *   get:
 *     summary: Get movies by release year range (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *           example: 2000
 *         description: Start year of the range.
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *           example: 2020
 *         description: End year of the range.
 *     responses:
 *       200:
 *         description: Movies by year range retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/movies-by-year",
  authMiddleware,
  checkAdminAccess,
  getMoviesByYearRange
);

/**
 * @swagger
 * /api/admin-stats/top-box-office:
 *   get:
 *     summary: Get top box office movies (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: >
 *           Maximum number of records to return.
 *           Defaults to 10.
 *     responses:
 *       200:
 *         description: Top box office movies retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/top-box-office",
  authMiddleware,
  checkAdminAccess,
  getTopBoxOfficeMovies
);

/**
 * @swagger
 * /api/admin-stats/movies-by-director:
 *   get:
 *     summary: Get movies by director (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: director
 *         schema:
 *           type: string
 *           example: "Christopher Nolan"
 *         description: Director's name to filter by.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: >
 *           Maximum number of records to return.
 *           Defaults to 10.
 *     responses:
 *       200:
 *         description: Movies by director retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/movies-by-director",
  authMiddleware,
  checkAdminAccess,
  getMoviesByDirector
);

/**
 * @swagger
 * /api/admin-stats/most-discussed:
 *   get:
 *     summary: Get most discussed movies (Admin Only)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: >
 *           Maximum number of records to return.
 *           Defaults to 10.
 *     responses:
 *       200:
 *         description: Most discussed movies retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get(
  "/most-discussed",
  authMiddleware,
  checkAdminAccess,
  getMostDiscussedMovies
);

module.exports = router;
