const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const postSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      default: () => uuidv4(), // Automatically generate a unique postId
      unique: true, // Ensure uniqueness of postId
    },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discussionBoard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscussionBoard",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model for likes
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply", // Reference to Reply model for replies
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Post", postSchema);
