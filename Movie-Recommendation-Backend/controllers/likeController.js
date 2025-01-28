const Like = require("../models/Like");
const RatingReview = require("../models/RatingReview");

const addLike = async (req, res) => {
  const { reviewId } = req.body;

  if (!reviewId || !/^[0-9a-fA-F]{24}$/.test(reviewId)) {
    return res.status(400).json({ error: "Invalid reviewId." });
  }

  try {
    // Check if the review exists
    const review = await RatingReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if the user has already liked this review
    const existingLike = await Like.findOne({
      review: reviewId,
      user: req.user.id,
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: "You have already liked this review." });
    }

    // Add new Like
    const newLike = new Like({
      review: reviewId,
      user: req.user.id,
    });

    await newLike.save();

    // Return updated like count
    const likeCount = await Like.countDocuments({ review: reviewId });
    res.status(201).json({
      message: "Like added successfully",
      likeCount,
    });
  } catch (error) {
    console.error("Error adding like:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addLike };
