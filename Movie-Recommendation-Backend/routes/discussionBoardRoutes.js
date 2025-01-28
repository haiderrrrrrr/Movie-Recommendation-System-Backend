const express = require("express");
const {
  createDiscussionBoard,
  getDiscussionBoards,
  getDiscussionBoardById,
  joinDiscussionBoard,
  unfollowDiscussionBoard,
  deleteDiscussionBoard,
  updateDiscussionBoard,
} = require("../controllers/discussionBoardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DiscussionBoards
 *   description: Management of discussion boards for Users
 */

/**
 * @swagger
 * /api/discussion-boards:
 *   post:
 *     summary: Create a new discussion board (Admin Only)
 *     tags: [DiscussionBoards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Action Movie Fans"
 *               description:
 *                 type: string
 *                 example: "Discuss your favorite action movies here!"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Movies", "Discussion"]
 *     responses:
 *       201:
 *         description: Discussion board created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Server error.
 */
router.post("/", authMiddleware, createDiscussionBoard);

/**
 * @swagger
 * /api/discussion-boards:
 *   get:
 *     summary: Get all discussion boards
 *     tags: [DiscussionBoards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor for pagination. This is the ID of the last record from the previous page.
 *         example:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of records to return. Defaults to 10.
 *         example: 10
 *     responses:
 *       200:
 *         description: Paginated list of discussion boards.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "63c9f488f0f7c78e2b123456"
 *                       title:
 *                         type: string
 *                         example: "Action Movie Fans"
 *                       description:
 *                         type: string
 *                         example: "Discuss your favorite action movies here!"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Action", "Movies", "Discussion"]
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "63c9f488f0f7c78e2b123457"
 *                             username:
 *                               type: string
 *                               example: "john_doe"
 *                       posts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "63c9f488f0f7c78e2b123458"
 *                             content:
 *                               type: string
 *                               example: "What are your thoughts on the new action movie?"
 *                 nextCursor:
 *                   type: string
 *                   description: Cursor for the next page of results.
 *                   example: "63c9f488f0f7c78e2b123459"
 *       500:
 *         description: Server error.
 */
router.get("/", authMiddleware, getDiscussionBoards);

/**
 * @swagger
 * /api/discussion-boards/{id}:
 *   get:
 *     summary: Get a specific discussion board by ID
 *     tags: [DiscussionBoards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the discussion board to retrieve.
 *           example: "673e2cae00ed70553bfa250f"
 *     responses:
 *       200:
 *         description: Discussion board details
 *       404:
 *         description: Discussion board not found.
 *       500:
 *         description: Server error.
 */
router.get("/:id", authMiddleware, getDiscussionBoardById);

/**
 * @swagger
 * /api/discussion-boards/{id}/join:
 *   post:
 *     summary: Join a discussion board
 *     tags: [DiscussionBoards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the discussion board to join.
 *           example: "673e31a95d349bafb14d7954"
 *     responses:
 *       200:
 *         description: Successfully joined the discussion board.
 *       404:
 *         description: Discussion board not found.
 *       500:
 *         description: Server error.
 */
router.post("/:id/join", authMiddleware, joinDiscussionBoard);

/**
 * @swagger
 * /api/discussion-boards/{id}/unfollow:
 *   post:
 *     summary: Unfollow a discussion board
 *     tags: [DiscussionBoards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the discussion board to unfollow.
 *           example: "673e31a95d349bafb14d7954"
 *     responses:
 *       200:
 *         description: Successfully unfollowed the discussion board.
 *       404:
 *         description: Discussion board not found.
 *       500:
 *         description: Server error.
 */
router.post("/:id/unfollow", authMiddleware, unfollowDiscussionBoard);

/**
 * @swagger
 * /api/discussion-boards/{id}:
 *   put:
 *     summary: Update a discussion board (Admin Only)
 *     tags: [DiscussionBoards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the discussion board to update.
 *           example: "673e32690d05bb5deb3b6af9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Action Movie Fans"
 *               description:
 *                 type: string
 *                 example: "Updated description for the board."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Movies", "Fans"]
 *     responses:
 *       200:
 *         description: Discussion board updated successfully.
 *       404:
 *         description: Discussion board not found.
 *       500:
 *         description: Server error.
 */
router.put("/:id", authMiddleware, updateDiscussionBoard);

/**
 * @swagger
 * /api/discussion-boards/{id}:
 *   delete:
 *     summary: Delete a discussion board (Admin Only)
 *     tags: [DiscussionBoards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the discussion board to delete.
 *           example: "673e32690d05bb5deb3b6af9"
 *     responses:
 *       200:
 *         description: Discussion board deleted successfully.
 *       404:
 *         description: Discussion board not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", authMiddleware, deleteDiscussionBoard);

module.exports = router;
