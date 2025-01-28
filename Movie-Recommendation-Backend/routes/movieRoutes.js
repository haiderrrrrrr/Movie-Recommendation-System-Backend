const express = require("express");
const {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovies,
} = require("../controllers/movieController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management by admin users and movie retrieval
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Add a new movie (Admin Only)
 *     tags: [Movies]
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
 *                 example: Inception
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Sci-Fi", "Thriller"]
 *               director:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Christopher Nolan
 *                   biography:
 *                     type: string
 *                     example: "Christopher Nolan is a British-American filmmaker known for his complex, non-linear storytelling."
 *                   filmography:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Inception (2010)", "The Dark Knight Trilogy (2005-2012)"]
 *                   awards:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Academy Award for Best Director (2018)", "Golden Globe for Best Director (2015)"]
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["https://example.com/nolan.jpg"]
 *               cast:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Leonardo DiCaprio
 *                     biography:
 *                       type: string
 *                       example: "Leonardo DiCaprio is an American actor, known for his roles in 'Titanic' and 'Inception'."
 *                     filmography:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Inception (2010)", "Titanic (1997)"]
 *                     awards:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Academy Award for Best Actor (2016)"]
 *                     photos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/dicaprio.jpg"]
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2010-07-16
 *               releaseYear:
 *                 type: number
 *                 example: 2010
 *               releaseDecade:
 *                 type: string
 *                 example: "2010s"
 *               countryOfOrigin:
 *                 type: string
 *                 example: "USA"
 *               language:
 *                 type: string
 *                 example: "English"
 *               originalTitle:
 *                 type: string
 *                 example: "Inception"
 *               runtime:
 *                 type: number
 *                 example: 148
 *               synopsis:
 *                 type: string
 *                 example: "A skilled thief is given a chance to redeem himself if he can successfully perform inception."
 *               averageRating:
 *                 type: number
 *                 example: 8.8
 *               movieCoverPhoto:
 *                 type: string
 *                 example: "https://example.com/inception.jpg"
 *               trivia:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["The spinning top scene was filmed in one take."]
 *               goofs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["In one scene, Dom's suit changes color."]
 *               soundtrack:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Time by Hans Zimmer"]
 *               parentalGuidance:
 *                 type: object
 *                 properties:
 *                   rating:
 *                     type: string
 *                     example: PG-13
 *                   description:
 *                     type: string
 *                     example: "Suitable for viewers above 13, contains intense scenes and mild language."
 *                   examples:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Mild violence", "Strong language"]
 *               popularity:
 *                 type: number
 *                 example: 85
 *               ratings:
 *                 type: object
 *                 properties:
 *                   IMDb:
 *                     type: number
 *                     example: 8.8
 *                   RottenTomatoes:
 *                     type: number
 *                     example: 86
 *                   Metacritic:
 *                     type: number
 *                     example: 74
 *                   AudienceScore:
 *                     type: number
 *                     example: 90
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["dream", "heist", "subconscious"]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["action", "sci-fi", "thriller"]
 *               newsAndArticles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Inception: A Cinematic Masterpiece"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2022-05-15"
 *                     summary:
 *                       type: string
 *                       example: "An article discussing the impact of Inception on modern cinema."
 *                     link:
 *                       type: string
 *                       example: "https://example.com/inception-article"
 *               boxOffice:
 *                 type: object
 *                 properties:
 *                   openingWeekendEarnings:
 *                     type: number
 *                     example: 50000000
 *                   totalEarnings:
 *                     type: number
 *                     example: 830000000
 *                   domesticRevenue:
 *                     type: number
 *                     example: 250000000
 *                   internationalRevenue:
 *                     type: number
 *                     example: 580000000
 *                   budget:
 *                     type: number
 *                     example: 160000000
 *                   worldwideGross:
 *                     type: number
 *                     example: 830000000
 *               awardsAndNominations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     award:
 *                       type: string
 *                       example: "Academy Award"
 *                     category:
 *                       type: string
 *                       example: "Best Picture"
 *                     result:
 *                       type: string
 *                       example: "Nominated"
 *                     year:
 *                       type: number
 *                       example: 2011
 *               relatedMovies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Interstellar"
 *                     year:
 *                       type: number
 *                       example: 2014
 *                     genre:
 *                       type: string
 *                       example: "Sci-Fi"
 *                     director:
 *                       type: string
 *                       example: "Christopher Nolan"
 *                     rating:
 *                       type: number
 *                       example: 8.6
 *                     synopsis:
 *                       type: string
 *                       example: "A group of astronauts travel through a wormhole in search of a new habitable planet."
 *               streamingPlatforms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Netflix", "Amazon Prime"]
 *               posterImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/inception-poster.jpg"]
 *               behindTheScenesPhotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/inception-bts.jpg"]
 *               sequels:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Inception 2"
 *                     releaseYear:
 *                       type: number
 *                       example: 2025
 *                     synopsis:
 *                       type: string
 *                       example: "The dream thief returns for another mind-bending adventure."
 *               prequels:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Inception: Origins"
 *                     releaseYear:
 *                       type: number
 *                       example: 2023
 *                     synopsis:
 *                       type: string
 *                       example: "A look into the creation of the technology used for inception."
 *               filmingLocations:
 *                 type: string
 *                 example: "Los Angeles, California"
 *               filmmakingTechniques:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Practical effects", "In-camera effects", "IMAX"]
 *     responses:
 *       201:
 *         description: Movie added successfully
 *       403:
 *         description: Access denied. Admin only.
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, addMovie);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get a list of movies (Admin Only)
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The ID of the last movie on the current page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of movies per page (defaults to 10)
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nextCursor:
 *                   type: string
 *                   description: The ID to be used as a cursor for the next page
 *                   example: 610d1c86f95c0b001a25e7d4
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 610d1c86f95c0b001a25e7d4
 *                       title:
 *                         type: string
 *                         example: Inception
 *                       genre:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Sci-Fi", "Thriller"]
 *                       director:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Christopher Nolan
 *                       releaseDate:
 *                         type: string
 *                         format: date
 *                         example: 2010-07-16
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getMovies);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update an existing movie (Admin Only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *         example: 673a1b1eb9e0caff9a6d9613
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception Updated
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Adventure"]
 *               director:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Christopher Nolan
 *                   biography:
 *                     type: string
 *                     example: "Christopher Nolan is a British-American filmmaker known for his complex, non-linear storytelling."
 *                   filmography:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Inception (2010)", "The Dark Knight Trilogy (2005-2012)"]
 *                   awards:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Academy Award for Best Director (2018)", "Golden Globe for Best Director (2015)"]
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["https://example.com/nolan.jpg"]
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2010-07-16
 *               runtime:
 *                 type: number
 *                 example: 148
 *               synopsis:
 *                 type: string
 *                 example: "A skilled thief is given a chance to redeem himself if he can successfully perform inception."
 *               averageRating:
 *                 type: number
 *                 example: 8.8
 *               movieCoverPhoto:
 *                 type: string
 *                 example: "https://example.com/inception.jpg"
 *               trivia:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["The spinning top scene was filmed in one take."]
 *               goofs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["In one scene, Dom's suit changes color."]
 *               soundtrack:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Time by Hans Zimmer"]
 *               parentalGuidance:
 *                 type: object
 *                 properties:
 *                   rating:
 *                     type: string
 *                     example: PG-13
 *                   description:
 *                     type: string
 *                     example: "Suitable for viewers above 13, contains intense scenes and mild language."
 *                   examples:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Mild violence", "Strong language"]
 *               popularity:
 *                 type: number
 *                 example: 85
 *               filmingLocations:
 *                 type: string
 *                 example: "Los Angeles, California"
 *               filmmakingTechniques:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Practical effects", "In-camera effects", "IMAX"]
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete an existing movie (Admin Only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *         example: 673a1b1eb9e0caff9a6d9613
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteMovie);

module.exports = router;
