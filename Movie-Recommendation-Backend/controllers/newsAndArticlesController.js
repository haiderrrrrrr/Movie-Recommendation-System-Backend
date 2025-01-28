const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const getCursorPaginationParams = require("../utils/pagination");

// Get News, Articles, Sequels, and Cast Information with Pagination
const getNewsAndUpdates = async (req, res) => {
  const { limit, query } = getCursorPaginationParams(req); // Cursor-based pagination params

  try {
    // Fetch movies based on the query and limit
    const movies = await Movie.find(query)
      .select("title genre newsAndArticles cast sequels") // Select only necessary fields
      .limit(limit)
      .sort({ _id: 1 }); // Sort by _id to ensure consistent pagination

    if (!movies.length) {
      return res.status(404).json({ message: "No movies found." });
    }

    // Format the response to return the required fields
    const moviesWithOrderedFields = movies.map((movie) => {
      return {
        id: movie._id,
        title: movie.title,
        genre: movie.genre,
        newsAndArticles: movie.newsAndArticles.map((article) => ({
          title: article.title,
          date: article.date,
          summary: article.summary,
          link: article.link,
        })),
        cast: movie.cast.map((actor) => ({
          name: actor.name,
          biography: actor.biography,
          awards: actor.awards,
        })),
        sequels: movie.sequels.map((sequel) => ({
          title: sequel.title,
          releaseYear: sequel.releaseYear,
          synopsis: sequel.synopsis,
        })),
      };
    });

    // Pagination handling
    const nextCursor = movies.length === limit ? movies[limit - 1]._id : null;

    res.status(200).json({
      data: moviesWithOrderedFields,
      pagination: {
        nextCursor,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching News and Updates:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update News, Articles, Sequels, and Cast Information
const updateNewsAndUpdates = async (req, res) => {
  const { movieId, newsAndArticles, sequels, cast } = req.body;

  if (!movieId || !newsAndArticles) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if movieId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  try {
    // Find the movie by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Update the News & Articles, Sequels, and Cast information
    movie.newsAndArticles = newsAndArticles;
    if (sequels) {
      movie.sequels = sequels; // Update sequels if provided
    }
    if (cast) {
      movie.cast = cast; // Update cast if provided
    }

    // Save the updated movie document to the database
    await movie.save();

    // Send a successful response
    res.status(200).json({
      message: "News, Updates, Sequels, and Cast updated successfully",
      data: movie,
    });
  } catch (error) {
    console.error(
      "Error updating News, Updates, Sequels, and Cast:",
      error.message
    );
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getNewsAndUpdates,
  updateNewsAndUpdates,
};
