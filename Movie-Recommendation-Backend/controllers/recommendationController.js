const Movie = require("../models/Movie");
const RatingReview = require("../models/RatingReview");
const User = require("../models/User");
const getCursorPaginationParams = require("../utils/pagination");

// Recommendation Algorithm - Personalized Recommendations with Pagination
const getMovieRecommendations = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Default preferences if user has none
    const defaultPreferences = {
      genres: ["Action", "Drama", "Comedy"],
      actors: ["Leonardo DiCaprio", "Tom Hardy", "Morgan Freeman"],
    };

    const userPreferences =
      user.preferences && user.preferences.genres.length > 0
        ? user.preferences
        : defaultPreferences;

    // Pagination logic
    const { limit, query } = getCursorPaginationParams(req);

    // Recommendations logic
    const genreMatch = await Movie.find({
      ...query,
      genre: { $in: userPreferences.genres },
    })
      .sort({ _id: 1 })
      .limit(limit);

    const actorMatch = await Movie.find({
      ...query,
      "cast.name": { $in: userPreferences.actors },
    })
      .sort({ _id: 1 })
      .limit(limit);

    const userRatings = await RatingReview.find({ user: user._id }).populate(
      "movie"
    );
    const ratedMovies = userRatings
      .map((rating) => rating.movie)
      .filter((movie) => movie !== null); // Ensure no null values

    const similarUsers = await User.find({
      "preferences.genres": { $in: userPreferences.genres },
    });

    const similarUserRatings = await RatingReview.find({
      user: { $in: similarUsers.map((u) => u._id) },
    }).populate("movie");

    const recommendedMovies = similarUserRatings
      .map((rating) => rating.movie)
      .filter(
        (movie) =>
          movie !== null && // Ensure no null values
          !ratedMovies.some((rated) => rated._id.equals(movie._id))
      );

    const recommendations = [
      ...new Set([...genreMatch, ...actorMatch, ...recommendedMovies]),
    ];

    const personalizedRecommendations = await Movie.find({
      ...query,
      _id: { $nin: ratedMovies.map((movie) => movie._id) },
      genre: { $in: userPreferences.genres },
    })
      .sort({ _id: 1 })
      .limit(limit);

    const nextCursor =
      personalizedRecommendations.length > 0
        ? personalizedRecommendations[personalizedRecommendations.length - 1]
            ._id
        : null;

    res.status(200).json({
      recommendations,
      personalizedRecommendations,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching movie recommendations:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Trending Movies with Pagination
const getTrendingMovies = async (req, res) => {
  try {
    const { limit, query } = getCursorPaginationParams(req);

    const trendingMovies = await Movie.find(query)
      .sort({ popularity: -1 })
      .limit(limit);

    const nextCursor =
      trendingMovies.length > 0
        ? trendingMovies[trendingMovies.length - 1]._id
        : null;

    res.status(200).json({ trendingMovies, nextCursor });
  } catch (error) {
    console.error("Error fetching trending movies:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Top Rated Movies with Pagination
const getTopRatedMovies = async (req, res) => {
  try {
    const { limit, query } = getCursorPaginationParams(req);

    const topRatedMovies = await Movie.find(query)
      .sort({ averageRating: -1 })
      .limit(limit);

    const nextCursor =
      topRatedMovies.length > 0
        ? topRatedMovies[topRatedMovies.length - 1]._id
        : null;

    res.status(200).json({ topRatedMovies, nextCursor });
  } catch (error) {
    console.error("Error fetching top-rated movies:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Similar Titles with Pagination
const getSimilarTitles = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { limit, query } = getCursorPaginationParams(req);

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const similarMovies = await Movie.find({
      ...query,
      $or: [
        { genre: { $in: movie.genre } },
        { "director.name": movie.director.name },
        {
          popularity: {
            $gte: movie.popularity - 10,
            $lte: movie.popularity + 10,
          },
        },
      ],
    })
      .sort({ popularity: -1 })
      .limit(limit);

    const nextCursor =
      similarMovies.length > 0
        ? similarMovies[similarMovies.length - 1]._id
        : null;

    res.status(200).json({ similarMovies, nextCursor });
  } catch (error) {
    console.error("Error fetching similar titles:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getMovieRecommendations,
  getTrendingMovies,
  getTopRatedMovies,
  getSimilarTitles,
};
