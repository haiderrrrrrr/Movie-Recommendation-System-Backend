require("dotenv").config(); // Load environment variables
const express = require("express");
const connectDB = require("./config/db"); // Database connection
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger");

const app = express();

app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB
connectDB();

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import routes
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes"); // Import movie routes
const ratingReviewRoutes = require("./routes/ratingReviewRoutes");
const likeRoutes = require("./routes/likeRoutes"); // Import like routes
const commentRoutes = require("./routes/commentRoutes"); // Import comment routes
const recommendationRoutes = require("./routes/recommendationRoutes"); // Import recommendation routes
const searchRoutes = require("./routes/searchRoutes"); // Import search routes
const boxOfficeRoutes = require("./routes/boxOfficeRoutes"); // Import box office and awards routes
const newsAndArticlesRoutes = require("./routes/newsAndArticlesRoutes"); // Import news and articles routes
const customListRoutes = require("./routes/customListRoutes"); // Import custom list routes
const trailerRoutes = require("./routes/trailerRoutes"); // Import trailer routes
const discussionBoardRoutes = require("./routes/discussionBoardRoutes"); // Import discussion board routes
const postRoutes = require("./routes/postRoutes"); // Import post routes
const adminStatsRoutes = require("./routes/adminStatsRoutes");

// Attach routes
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes); // Attach movie routes
app.use("/api/rating-reviews", ratingReviewRoutes);
app.use("/api/likes", likeRoutes); // Attach like routes
app.use("/api/comments", commentRoutes); // Attach comment routes
app.use("/api/recommendations", recommendationRoutes); // Attach recommendation routes
app.use("/api/search", searchRoutes); // Attach search routes
app.use("/api/box-office-awards", boxOfficeRoutes); // Attach box office and awards routes
app.use("/api/news-and-updates", newsAndArticlesRoutes); // Attach news and articles routes
app.use("/api/custom-lists", customListRoutes); // Attach custom list routes
app.use("/api/trailers", trailerRoutes); // Attach trailer routes
app.use("/api/discussion-boards", discussionBoardRoutes); // Attach discussion board routes
app.use("/api/posts", postRoutes); // Attach post routes
app.use("/api/admin-stats", adminStatsRoutes);

// Log all routes (for debugging purposes)
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path); // Log the registered route paths
  }
});

// Base route for the API
app.get("/", (req, res) => {
  res.send("Movie Recommendation System API is running...");
});

// Fallback route for unmatched URLs
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger available at http://localhost:${PORT}/api-docs`);
});
