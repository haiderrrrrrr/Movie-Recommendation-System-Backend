const express = require("express");
const { addLike } = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Like
 *     description: Operation for liking reviews
 */

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Like a review
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: string
 *                 example: 673e9456f095d21baf84615c
 *     responses:
 *        201:
 *          description: Like added successfully
 *        400:
 *          description: Invalid reviewId or already liked
 *        500:
 *          description: Server error
 */
router.post("/", authMiddleware, addLike);

module.exports = router;
