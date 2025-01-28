const express = require("express");
const {
  createPost,
  updatePost,
  deletePost,
  getPostsForDiscussionBoard,
  getPostById,
  addCommentToPost,
  likePost,
  unlikePost,
  getCommentsForPost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Management of posts in discussion boards
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post in a discussion board
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "What are your thoughts on the new action movie?"
 *               discussionBoardId:
 *                 type: string
 *                 example: "673e31a95d349bafb14d7954"
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Validation error or missing parameters.
 *       403:
 *         description: User not following the discussion board.
 *       500:
 *         description: Server error.
 */
router.post("/", authMiddleware, createPost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the post to update.
 *           example: "e381bf62-32cf-4174-938d-86543cb8848f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated content for the post."
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       403:
 *         description: User not following the discussion board or unauthorized.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Server error.
 */
router.put("/:postId", authMiddleware, updatePost);

// /**
//  * @swagger
//  * /api/posts/{postId}:
//  *   delete:
//  *     summary: Delete a post
//  *     tags: [Posts]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: postId
//  *         schema:
//  *           type: string
//  *           required: true
//  *           description: The ID of the post to delete.
//  *           example: "63c9f488f0f7c78e2b123457"
//  *     responses:
//  *       200:
//  *         description: Post deleted successfully.
//  *       403:
//  *         description: User not following the discussion board or unauthorized.
//  *       404:
//  *         description: Post not found.
//  *       500:
//  *         description: Server error.
//  */
// router.delete("/:postId", authMiddleware, deletePost);

/**
 * @swagger
 * /api/posts/discussion-board/{discussionBoardId}:
 *   get:
 *     summary: Get all posts for a discussion board
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: discussionBoardId
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the discussion board to fetch posts for.
 *           example: "673e2cae00ed70553bfa250f"
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           description: Cursor for pagination.
 *           example:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Limit for the number of posts returned.
 *           example: 10
 *     responses:
 *       200:
 *         description: List of posts for the discussion board with pagination.
 *       500:
 *         description: Server error.
 */
router.get(
  "/discussion-board/:discussionBoardId",
  authMiddleware,
  getPostsForDiscussionBoard
);

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the post to retrieve.
 *           example: "f14c2e97-7f48-486f-928a-25b9e34f7e80"
 *     responses:
 *       200:
 *         description: Post details.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Server error.
 */
router.get("/:postId", authMiddleware, getPostById);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the post to fetch comments for.
 *           example: "f14c2e97-7f48-486f-928a-25b9e34f7e80"
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           description: Cursor for pagination.
 *           example:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Limit for the number of comments returned.
 *           example: 10
 *     responses:
 *       200:
 *         description: List of comments for the post with pagination.
 *       500:
 *         description: Server error.
 */
router.get("/:postId/comments", authMiddleware, getCommentsForPost);

/**
 * @swagger
 * /api/posts/comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "f14c2e97-7f48-486f-928a-25b9e34f7e80"
 *               content:
 *                 type: string
 *                 example: "Great point! I totally agree."
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *       500:
 *         description: Server error.
 */
router.post("/comment", authMiddleware, addCommentToPost);

/**
 * @swagger
 * /api/posts/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "f14c2e97-7f48-486f-928a-25b9e34f7e80"
 *     responses:
 *       201:
 *         description: Post liked successfully.
 *       500:
 *         description: Server error.
 */
router.post("/like", authMiddleware, likePost);

// /**
//  * @swagger
//  * /api/posts/like:
//  *   delete:
//  *     summary: Unlike a post
//  *     tags: [Posts]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               postId:
//  *                 type: string
//  *                 example: "63c9f488f0f7c78e2b123457"
//  *     responses:
//  *       200:
//  *         description: Post unliked successfully.
//  *       404:
//  *         description: Like not found.
//  *       500:
//  *         description: Server error.
//  */
// router.delete("/like", authMiddleware, unlikePost);

module.exports = router;
