const express = require("express");
const {
  addRatingReview,
  updateRatingReview,
  getRatingsReviews,
  getReviewHighlights,
} = require("../controllers/ratingReviewController");
const { addLike } = require("../controllers/likeController");
const { addComment } = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Rating and Review
 *     description: Management of Rating and Review on Movies
 */

/**
 * @swagger
 * /api/rating-reviews:
 *   post:
 *     summary: Add a rating and review for a movie
 *     tags: [Rating and Review]
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
 *                 example: 673a171ab9e0caff9a6d949f
 *               rating:
 *                 type: number
 *                 example: 4
 *               review:
 *                 type: string
 *                 example: "Great movie with an interesting plot!"
 *     responses:
 *        201:
 *          description: Review added successfully
 *        400:
 *          description: Invalid movieId or rating
 *        500:
 *          description: Server error
 */
router.post("/", authMiddleware, addRatingReview);

/**
 * @swagger
 * /api/rating-reviews:
 *   put:
 *     summary: Update an existing rating and review
 *     tags: [Rating and Review]
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
 *                 example: 673a171ab9e0caff9a6d949f
 *               rating:
 *                 type: number
 *                 example: 5
 *               review:
 *                 type: string
 *                 example: "Amazing movie, loved the ending!"
 *     responses:
 *        200:
 *          description: Review updated successfully
 *        400:
 *          description: Invalid input or already reviewed
 *        404:
 *          description: Review not found
 *        500:
 *          description: Server error
 */
router.put("/", authMiddleware, updateRatingReview);

/**
 * @swagger
 * /api/rating-reviews:
 *   get:
 *     summary: Get all ratings and reviews for a movie
 *     tags: [Rating and Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: movieId
 *         required: false
 *         schema:
 *           type: string
 *           example: 673a171ab9e0caff9a6d949f
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of reviews per page (optional, default is 10)
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The cursor to paginate through results (optional)
 *     responses:
 *        200:
 *          description: Successfully fetched ratings and reviews
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  nextCursor:
 *                    type: string
 *                    description: The cursor for the next page of results (null if no more results)
 *                  ratingReviews:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        movie:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            synopsis:
 *                              type: string
 *                            averageRating:
 *                              type: number
 *                            movieCoverPhoto:
 *                              type: string
 *                        user:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            username:
 *                              type: string
 *                        rating:
 *                          type: number
 *                        review:
 *                          type: string
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *        400:
 *          description: Invalid movieId or pagination parameters
 *        500:
 *          description: Server error
 */
router.get("/", authMiddleware, getRatingsReviews);

/**
 * @swagger
 * /api/rating-reviews/highlights:
 *   get:
 *     summary: Get review highlights for top-rated and most-discussed reviews
 *     tags: [Rating and Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: movieId
 *         required: false
 *         schema:
 *           type: string
 *           example: 673a171ab9e0caff9a6d949f
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of reviews per page (optional, default is 10)
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The cursor to paginate through results (optional)
 *     responses:
 *        200:
 *          description: Successfully fetched review highlights
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  reviewHighlights:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        movie:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            synopsis:
 *                              type: string
 *                            averageRating:
 *                              type: number
 *                            movieCoverPhoto:
 *                              type: string
 *                        user:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            username:
 *                              type: string
 *                        rating:
 *                          type: number
 *                        review:
 *                          type: string
 *                        likeCount:
 *                          type: integer
 *                        commentCount:
 *                          type: integer
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *        400:
 *          description: Invalid movieId or pagination parameters
 *        500:
 *          description: Server error
 */
router.get("/highlights", authMiddleware, getReviewHighlights);

module.exports = router;
