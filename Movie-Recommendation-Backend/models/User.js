const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    preferences: {
      genres: { type: [String], default: [] },
      actors: { type: [String], default: [] },
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    customLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomList",
      },
    ],
    followedLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomList",
      },
    ],
    followedDiscussionBoards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiscussionBoard",
      },
    ],
    participatedDiscussionBoards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiscussionBoard",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likedReplies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
