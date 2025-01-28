const express = require("express");
const {
  getBoxOfficeAndAwards,
  updateBoxOfficeAndAwards,
} = require("../controllers/boxOfficeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Box Office & Awards
 *     description: Management of Box Office and Awards for Movies
 */

/**
 * @swagger
 * /api/box-office-awards:
 *   get:
 *     summary: Get Box Office and Awards Information
 *     tags: [Box Office & Awards]
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
 *         description: Successfully retrieved box office and awards information
 *       404:
 *         description: No movies found
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getBoxOfficeAndAwards);

/**
 * @swagger
 * /api/box-office-awards:
 *   put:
 *     summary: Update Box Office, Awards, Director, and Cast Information
 *     tags: [Box Office & Awards]
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
 *               boxOffice:
 *                 type: object
 *                 properties:
 *                   openingWeekendEarnings:
 *                     type: number
 *                     example: 5000000
 *                   totalEarnings:
 *                     type: number
 *                     example: 150000000
 *                   domesticRevenue:
 *                     type: number
 *                     example: 70000000
 *                   internationalRevenue:
 *                     type: number
 *                     example: 80000000
 *                   budget:
 *                     type: number
 *                     example: 50000000
 *                   worldwideGross:
 *                     type: number
 *                     example: 200000000
 *               awardsAndNominations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     award:
 *                       type: string
 *                       example: "Oscar"
 *                     category:
 *                       type: string
 *                       example: "Best Actor"
 *                     result:
 *                       type: string
 *                       example: "Nominee"
 *                     year:
 *                       type: integer
 *                       example: 2024
 *               director:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Steven Spielberg"
 *                   biography:
 *                     type: string
 *                     example: "Steven Spielberg is an American film director."
 *                   awards:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Academy Award for Best Director"
 *               cast:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tom Hanks"
 *                     biography:
 *                       type: string
 *                       example: "Tom Hanks is an American actor known for his roles in Forrest Gump, Cast Away, etc."
 *                     awards:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Academy Award for Best Actor"
 *     responses:
 *       200:
 *         description: Successfully updated box office, awards, director, and cast information
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.put("/", authMiddleware, updateBoxOfficeAndAwards);

module.exports = router;
