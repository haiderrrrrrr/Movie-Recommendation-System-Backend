const express = require("express");
const { addComment } = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comment
 *     description: Operation for commenting reviews
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add a comment on a review
 *     tags: [Comment]
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
 *               comment:
 *                 type: string
 *                 example: "I completely agree with your review!"
 *                 description: "The comment added by the user on the review."
 *     responses:
 *        201:
 *          description: Comment added successfully
 *        400:
 *          description: Invalid reviewId or missing comment text
 *        500:
 *          description: Server error
 */
router.post("/", authMiddleware, addComment);

module.exports = router;
