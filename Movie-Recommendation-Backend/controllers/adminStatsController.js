const Movie = require("../models/Movie");
const getCursorPaginationParams = require("../utils/pagination");

// Middleware to check if the user is an admin
const checkAdminAccess = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

// Get the most popular movies with pagination
const getMostPopularMovies = async (req, res) => {
    
  const { limit, query } = getCursorPaginationParams(req);

  try {
    const movies = await Movie.find(query)
      .sort({ popularity: -1 }) // Sort by popularity in descending order
      .limit(limit); // Apply pagination limit
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    res.status(200).json({
      message: "Most popular movies retrieved",
      data: movies,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get trending genres with pagination (Fixed)
const getTrendingGenres = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);

  try {
    const genres = await Movie.aggregate([
      { $unwind: "$genre" }, // Unwind the genre array
      { $group: { _id: "$genre", count: { $sum: 1 } } }, // Group by genre and count occurrences
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: limit }, // Apply pagination limit
    ]);
    const nextCursor = genres.length > 0 ? genres[genres.length - 1]._id : null;

    res.status(200).json({
      message: "Trending genres retrieved",
      data: genres,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching trending genres:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get most searched actors with pagination
const getMostSearchedActors = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);

  try {
    const actors = await Movie.aggregate([
      { $unwind: "$cast" }, // Unwind the cast array
      { $group: { _id: "$cast.name", count: { $sum: 1 } } }, // Group by actor name and count occurrences
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: limit }, // Apply pagination limit
    ]);
    const nextCursor = actors.length > 0 ? actors[actors.length - 1]._id : null;

    res.status(200).json({
      message: "Most searched actors retrieved",
      data: actors,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching most searched actors:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user engagement patterns with pagination
const getUserEngagementPatterns = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);

  try {
    const movies = await Movie.aggregate([
      {
        $project: {
          title: 1,
          totalRatings: {
            $sum: [
              "$ratings.IMDb",
              "$ratings.RottenTomatoes",
              "$ratings.Metacritic",
            ],
          },
        },
      },
      { $sort: { totalRatings: -1 } }, // Sort by total ratings in descending order
      { $limit: limit }, // Apply pagination limit
    ]);
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    res.status(200).json({
      message: "User engagement patterns retrieved",
      data: movies,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching user engagement patterns:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get top-rated movies by genre with pagination
const getTopRatedMoviesByGenre = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);
  const { genre } = req.query;

  if (!genre) {
    return res.status(400).json({ error: "Genre is required." });
  }

  try {
    const movies = await Movie.find({ genre })
      .sort({ averageRating: -1 }) // Sort by average rating in descending order
      .limit(limit);
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    res.status(200).json({
      message: `Top-rated movies in the '${genre}' genre retrieved`,
      data: movies,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching top-rated movies by genre:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get movies by release year range with pagination
const getMoviesByYearRange = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);
  const { startYear, endYear } = req.query;

  if (!startYear || !endYear) {
    return res
      .status(400)
      .json({ error: "Start year and end year are required." });
  }

  try {
    const movies = await Movie.find({
      releaseYear: { $gte: parseInt(startYear), $lte: parseInt(endYear) },
    })
      .sort({ releaseYear: 1 }) // Sort by release year in ascending order
      .limit(limit);
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    res.status(200).json({
      message: `Movies released between ${startYear} and ${endYear} retrieved`,
      data: movies,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching movies by year range:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get top box office movies with pagination
const getTopBoxOfficeMovies = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);

  try {
    const movies = await Movie.find()
      .sort({ "boxOffice.worldwideGross": -1 }) // Sort by worldwide gross revenue
      .limit(limit);
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    res.status(200).json({
      message: "Top box office movies retrieved",
      data: movies,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching top box office movies:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get movies by director with pagination
const getMoviesByDirector = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);
  const { director } = req.query;

  if (!director) {
    return res.status(400).json({ error: "Director name is required." });
  }

  try {
    const movies = await Movie.find({ "director.name": director })
      .sort({ releaseYear: -1 }) // Sort by release year in descending order
      .limit(limit);
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    res.status(200).json({
      message: `Movies directed by '${director}' retrieved`,
      data: movies,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching movies by director:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get most discussed movies with pagination
const getMostDiscussedMovies = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);

  try {
    const movies = await Movie.aggregate([
      { $project: { title: 1, newsCount: { $size: "$newsAndArticles" } } },
      { $sort: { newsCount: -1 } }, // Sort by news count in descending order
      { $limit: limit },
    ]);
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    res.status(200).json({
      message: "Most discussed movies retrieved",
      data: movies,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching most discussed movies:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getMostPopularMovies,
  getTrendingGenres,
  getMostSearchedActors,
  getUserEngagementPatterns,
  getTopRatedMoviesByGenre,
  getMoviesByYearRange,
  getTopBoxOfficeMovies,
  getMoviesByDirector,
  getMostDiscussedMovies,
  checkAdminAccess,
};
