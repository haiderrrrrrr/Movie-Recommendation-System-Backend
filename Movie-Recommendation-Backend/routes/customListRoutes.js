const express = require("express");
const {
  createCustomList,
  getCustomLists,
  addMovieToList,
  followCustomList,
  removeMovieFromList,
  getCustomListById,
  unfollowCustomList,
  updateCustomList,
  deleteCustomList,
  shareCustomList,
} = require("../controllers/customListController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: CustomList
 *     description: Management of Custom Lists for Users Movies
 */

/**s
 * @swagger
 * components:
 *   schemas:
 *     CustomList:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "673a4bef381d7827959fce8c"
 *         name:
 *           type: string
 *           example: "Best Horror Movies"
 *         description:
 *           type: string
 *           example: "A list of the best horror movies."
 *         isPublic:
 *           type: boolean
 *           example: true
 *         movies:
 *           type: array
 *           items:
 *             type: string
 *             example: "673a1b32b9e0caff9a6d961c"
 *       required:
 *         - id
 *         - name
 *         - description
 *         - isPublic
 */

/**
 * @swagger
 * /api/custom-lists:
 *   post:
 *     summary: Create a new custom list
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Best Horror Movies"
 *               description:
 *                 type: string
 *                 example: "A list of the best horror movies."
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               movies:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "673a1b32b9e0caff9a6d961c"
 *     responses:
 *        201:
 *          description: Custom list created successfully
 *        400:
 *          description: Invalid data
 *        500:
 *          description: Server error
 */
router.post("/", authMiddleware, createCustomList);

/**
 * @swagger
 * /api/custom-lists:
 *   get:
 *     summary: Get all custom lists
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: cursor
 *         description: ID of the last item from the previous page
 *         schema:
 *           type: string
 *     responses:
 *        200:
 *          description: List of custom lists with pagination, including shareable link
 *          content:
 *            application/json:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    example: "673a4bef381d7827959fce8c"
 *                  name:
 *                    type: string
 *                    example: "Best Horror Movies"
 *                  description:
 *                    type: string
 *                    example: "A list of the best horror movies."
 *                  isPublic:
 *                    type: boolean
 *                    example: true
 *                  shareableLink:
 *                    type: string
 *                    example: "https://localhost:5000/api/custom-lists/673a4bef381d7827959fce8c"
 *                  movies:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: "673a1b32b9e0caff9a6d961c"
 *        500:
 *          description: Server error
 */
router.get("/", authMiddleware, getCustomLists);

/**
 * @swagger
 * /api/custom-lists/follow:
 *   put:
 *     summary: Follow a custom list
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listId:
 *                 type: string
 *                 example: "673a4bef381d7827959fce8c"
 *     responses:
 *        200:
 *          description: Successfully followed the custom list
 *        400:
 *          description: Already following this list
 *        404:
 *          description: Custom list not found
 *        500:
 *          description: Server error
 */
router.put("/follow", authMiddleware, followCustomList);

/**
 * @swagger
 * /api/custom-lists/unfollow:
 *   put:
 *     summary: Unfollow a custom list
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listId:
 *                 type: string
 *                 example: "673a4bef381d7827959fce8c"
 *     responses:
 *        200:
 *          description: Successfully unfollowed the custom list
 *        400:
 *          description: Not following this list
 *        404:
 *          description: Custom list not found
 *        500:
 *          description: Server error
 */
router.put("/unfollow", authMiddleware, unfollowCustomList);

/**
 * @swagger
 * /api/custom-lists/add-movie:
 *   put:
 *     summary: Add a movie to a custom list
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listId:
 *                 type: string
 *                 example: "673e00720f78c3f425ebcd68"
 *               movieId:
 *                 type: string
 *                 example: "673a16e5b9e0caff9a6d9496"
 *     responses:
 *        200:
 *          description: Movie added to the list
 *        400:
 *          description: Invalid data or movie already in the list
 *        404:
 *          description: Custom list or movie not found
 *        500:
 *          description: Server error
 */
router.put("/add-movie", authMiddleware, addMovieToList);

/**
 * @swagger
 * /api/custom-lists/remove-movie:
 *   put:
 *     summary: Remove a movie from a custom list
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listId:
 *                 type: string
 *                 example: "673e00720f78c3f425ebcd68"
 *               movieId:
 *                 type: string
 *                 example: "673a16e5b9e0caff9a6d9496"
 *     responses:
 *        200:
 *          description: Movie removed from the list
 *        400:
 *          description: Movie not found in the list
 *        404:
 *          description: Custom list or movie not found
 *        500:
 *          description: Server error
 */
router.put("/remove-movie", authMiddleware, removeMovieFromList);

/**
 * @swagger
 * /api/custom-lists/{id}:
 *   put:
 *     summary: Update a custom list
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "673e00720f78c3f425ebcd68"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Best Action Movies"
 *               description:
 *                 type: string
 *                 example: "Updated list description"
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *        200:
 *          description: Custom list updated successfully
 *        400:
 *          description: Invalid data
 *        404:
 *          description: Custom list not found
 *        500:
 *          description: Server error
 */
router.put("/:id", authMiddleware, updateCustomList);

/**
 * @swagger
 * /api/custom-lists/{id}:
 *   delete:
 *     summary: Delete a custom list
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "673e00720f78c3f425ebcd68"
 *     responses:
 *        200:
 *          description: Custom list deleted successfully
 *        404:
 *          description: Custom list not found
 *        500:
 *          description: Server error
 */
router.delete("/:id", authMiddleware, deleteCustomList);

/**
 * @swagger
 * /api/custom-lists/share/{id}:
 *   post:
 *     summary: Share a custom list via email or WhatsApp
 *     tags: [CustomList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the custom list to be shared.
 *           example: "673a6118adcecce892007ef1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The recipient's email address.
 *                 example: "testingprojectmail2024@gmail.com"
 *               whatsapp:
 *                 type: string
 *                 description: The recipient's WhatsApp number (optional).
 *                 example: "+923035120027"
 *               sms:
 *                 type: string
 *                 description: The recipient's SMS number (optional).
 *                 example: "+923321606103"
 *               message:
 *                 type: string
 *                 description: Custom message to include in the email or WhatsApp.
 *                 example: "Yooo! Check out this amazing custom list!"
 *     responses:
 *       200:
 *         description: Custom list shared successfully via email or WhatsApp.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Custom list shared successfully
 *       400:
 *         description: Invalid input data or the custom list is private.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cannot share a private custom list
 *       404:
 *         description: Custom list not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Custom list not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.post("/share/:id", authMiddleware, shareCustomList);

/**
 * @swagger
 * /api/custom-lists/{id}:
 *   get:
 *     summary: Get a custom list by ID
 *     tags: [CustomList]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the custom list to retrieve.
 *           example: "63c9f488f0f7c78e2b123456"
 *     responses:
 *       200:
 *         description: Custom list fetched successfully.
 *       404:
 *         description: Custom list not found.
 *       500:
 *         description: Server error.
 */
router.get("/:id", getCustomListById);

module.exports = router;
