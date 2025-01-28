const Comment = require("../models/Comment");
const RatingReview = require("../models/RatingReview");

const addComment = async (req, res) => {
  const { reviewId, comment } = req.body; // Use 'comment' instead of 'text'

  // Validate reviewId format
  if (!reviewId || !/^[0-9a-fA-F]{24}$/.test(reviewId)) {
    return res.status(400).json({ error: "Invalid reviewId format." });
  }

  // Validate comment text
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Comment text is required." });
  }

  try {
    // Check if the review exists
    const review = await RatingReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Add new Comment
    const newComment = new Comment({
      review: reviewId,
      user: req.user.id, // Assuming req.user.id is populated by the authMiddleware
      comment, // Store 'comment' instead of 'text'
    });

    await newComment.save();

    // Return updated comment count for the review
    const commentCount = await Comment.countDocuments({ review: reviewId });
    res.status(201).json({
      message: "Comment added successfully",
      commentCount,
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addComment };
