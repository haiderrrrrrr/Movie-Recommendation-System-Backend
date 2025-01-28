const RatingReview = require("../models/RatingReview");
const Movie = require("../models/Movie");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const getCursorPaginationParams = require("../utils/pagination");

// Add a new Rating and Review
const addRatingReview = async (req, res) => {
  const { movieId, rating, review } = req.body;

  if (!movieId || !/^[0-9a-fA-F]{24}$/.test(movieId)) {
    return res.status(400).json({ error: "Invalid movieId." });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const existingReview = await RatingReview.findOne({
      movie: movieId,
      user: req.user.id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this movie." });
    }

    const newRatingReview = new RatingReview({
      movie: movieId,
      user: req.user.id,
      rating,
      review,
    });

    await newRatingReview.save();

    return res.status(201).json({
      message: "Review added successfully",
      ratingReview: newRatingReview,
      movie: {
        title: movie.title,
        synopsis: movie.synopsis,
        averageRating: movie.averageRating,
        movieCoverPhoto: movie.movieCoverPhoto,
      },
    });
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update an existing Rating and Review
const updateRatingReview = async (req, res) => {
  const { movieId, rating, review } = req.body;

  if (!movieId || !/^[0-9a-fA-F]{24}$/.test(movieId)) {
    return res.status(400).json({ error: "Invalid movieId." });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  try {
    let ratingReview = await RatingReview.findOne({
      movie: movieId,
      user: req.user.id,
    });

    if (!ratingReview) {
      return res.status(404).json({ error: "Review not found." });
    }

    ratingReview.rating = rating;
    ratingReview.review = review || ratingReview.review;
    await ratingReview.save();

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.status(200).json({
      message: "Review updated successfully",
      ratingReview,
      movie: {
        title: movie.title,
        synopsis: movie.synopsis,
        averageRating: movie.averageRating,
        movieCoverPhoto: movie.movieCoverPhoto,
      },
    });
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Ratings and Reviews with Pagination
const getRatingsReviews = async (req, res) => {
  const { limit, query } = getCursorPaginationParams(req);
  const { movieId } = req.query;

  if (movieId && !/^[0-9a-fA-F]{24}$/.test(movieId)) {
    return res.status(400).json({ error: "Invalid movieId." });
  }

  if (movieId) {
    query.movie = movieId;
  }

  try {
    const ratingReviews = await RatingReview.find(query)
      .populate("user", "username")
      .populate("movie", "title synopsis averageRating movieCoverPhoto")
      .limit(limit);

    const nextCursor =
      ratingReviews.length > 0
        ? ratingReviews[ratingReviews.length - 1].reviewId
        : null;

    res.status(200).json({
      nextCursor,
      ratingReviews,
    });
  } catch (error) {
    console.error("Error fetching ratings and reviews:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Review Highlights
const getReviewHighlights = async (req, res) => {
  const { limit } = getCursorPaginationParams(req);
  const { movieId } = req.query;

  if (movieId && !/^[0-9a-fA-F]{24}$/.test(movieId)) {
    return res.status(400).json({ error: "Invalid movieId." });
  }

  try {
    const query = movieId ? { movie: movieId } : {};

    const reviewHighlights = await RatingReview.find(query)
      .populate("user", "username")
      .populate("movie", "title synopsis averageRating movieCoverPhoto")
      .sort({ rating: -1 })
      .limit(limit);

    const filteredHighlights = await Promise.all(
      reviewHighlights.map(async (review) => {
        const likeCount = await Like.countDocuments({ review: review._id });
        const comments = await Comment.find({ review: review._id }).populate(
          "user",
          "username"
        );
        const commentCount = comments.length;

        if (likeCount > 0 && commentCount > 0) {
          return {
            ...review.toObject(),
            likeCount,
            commentCount,
            comments,
          };
        }

        return null;
      })
    );

    const result = filteredHighlights.filter((highlight) => highlight !== null);

    res.status(200).json({
      reviewHighlights: result,
    });
  } catch (error) {
    console.error("Error in fetching review highlights:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addRatingReview,
  updateRatingReview,
  getRatingsReviews,
  getReviewHighlights,
};
