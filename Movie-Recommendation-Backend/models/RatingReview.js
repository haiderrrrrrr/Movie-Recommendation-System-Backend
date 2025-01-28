const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // To generate unique IDs

const ratingReviewSchema = new mongoose.Schema(
  {
    reviewId: {
      type: String,
      default: uuidv4, // Automatically generates a unique ID for each review
      unique: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie", // Reference to the Movie model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Ratings should be between 1 and 5
    },
    review: {
      type: String,
      required: false, // Review is optional, but rating is required
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create a virtual field to get the review summary
ratingReviewSchema.virtual("reviewSummary").get(function () {
  return this.review ? this.review.substring(0, 100) + "..." : "No review text";
});

// Static method to calculate average rating for a movie
ratingReviewSchema.statics.getAverageRating = async function (movieId) {
  const result = await this.aggregate([
    { $match: { movie: movieId } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } },
  ]);
  return result.length > 0 ? result[0].averageRating : 0;
};

// Pre-save middleware to ensure unique `reviewId`
ratingReviewSchema.pre("save", function (next) {
  if (!this.reviewId) {
    this.reviewId = uuidv4();
  }
  next();
});

// Create and export the RatingReview model
const RatingReview = mongoose.model("RatingReview", ratingReviewSchema);

module.exports = RatingReview;
