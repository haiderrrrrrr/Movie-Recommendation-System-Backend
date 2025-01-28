const DiscussionBoard = require("../models/DiscussionBoard");
const Post = require("../models/Post");
const User = require("../models/User");
const getCursorPaginationParams = require("../utils/pagination");

// Helper function to validate required fields
const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") {
      return `${key} is required.`;
    }
  }
  return null;
};

// Create a discussion board (Admin Only)
const createDiscussionBoard = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { title, description, tags } = req.body;

  // Validate input
  const errorMessage = validateFields({ title, description });
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  try {
    const newBoard = new DiscussionBoard({
      title,
      description,
      tags: tags || [],
    });

    await newBoard.save();
    res.status(201).json({
      message: "Discussion board created successfully",
      data: newBoard,
    });
  } catch (error) {
    console.error("Error creating discussion board:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all discussion boards
const getDiscussionBoards = async (req, res) => {
  const { limit, query } = getCursorPaginationParams(req); // Pagination utility function

  try {
    const boards = await DiscussionBoard.find(query)
      .limit(limit)
      .populate("participants", "username")
      .populate("posts")
      .sort({ _id: 1 }); // Sort by ID for consistent pagination

    const nextCursor = boards.length > 0 ? boards[boards.length - 1]._id : null; // Next cursor for pagination

    res.status(200).json({
      boards,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching discussion boards:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single discussion board
const getDiscussionBoardById = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || id.trim() === "") {
    return res.status(400).json({ error: "Discussion board ID is required." });
  }

  try {
    const board = await DiscussionBoard.findById(id)
      .populate("participants", "username")
      .populate({
        path: "posts",
        populate: { path: "author", select: "username" },
      });
    if (!board)
      return res.status(404).json({ error: "Discussion board not found" });

    res.status(200).json(board);
  } catch (error) {
    console.error("Error fetching discussion board:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a participant to a discussion board
const joinDiscussionBoard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Validate ID
  if (!id || id.trim() === "") {
    return res.status(400).json({ error: "Discussion board ID is required." });
  }

  try {
    const board = await DiscussionBoard.findById(id);
    if (!board)
      return res.status(404).json({ error: "Discussion board not found" });

    if (board.participants.includes(userId)) {
      return res.status(400).json({ error: "User already joined this board" });
    }

    board.participants.push(userId);
    await board.save();

    res
      .status(200)
      .json({ message: "Successfully joined the discussion board" });
  } catch (error) {
    console.error("Error joining discussion board:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Unfollow a discussion board
const unfollowDiscussionBoard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Validate ID
  if (!id || id.trim() === "") {
    return res.status(400).json({ error: "Discussion board ID is required." });
  }

  try {
    const board = await DiscussionBoard.findById(id);
    if (!board)
      return res.status(404).json({ error: "Discussion board not found" });

    if (!board.participants.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User is not a participant of this board" });
    }

    board.participants = board.participants.filter(
      (participant) => participant.toString() !== userId
    );

    await board.save();
    res
      .status(200)
      .json({ message: "Successfully unfollowed the discussion board" });
  } catch (error) {
    console.error("Error unfollowing discussion board:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a discussion board (Admin Only)
const deleteDiscussionBoard = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { id } = req.params;

  // Validate ID
  if (!id || id.trim() === "") {
    return res.status(400).json({ error: "Discussion board ID is required." });
  }

  try {
    const board = await DiscussionBoard.findByIdAndDelete(id);
    if (!board)
      return res.status(404).json({ error: "Discussion board not found" });

    res.status(200).json({ message: "Discussion board deleted successfully" });
  } catch (error) {
    console.error("Error deleting discussion board:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a discussion board (Admin Only)
const updateDiscussionBoard = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { id } = req.params;
  const { title, description, tags } = req.body;

  // Validate input
  if (!id || id.trim() === "") {
    return res.status(400).json({ error: "Discussion board ID is required." });
  }

  const errorMessage = validateFields({ title, description });
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  try {
    const updatedBoard = await DiscussionBoard.findByIdAndUpdate(
      id,
      { title, description, tags },
      { new: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: "Discussion board not found" });
    }

    res.status(200).json({
      message: "Discussion board updated successfully",
      data: updatedBoard,
    });
  } catch (error) {
    console.error("Error updating discussion board:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createDiscussionBoard,
  getDiscussionBoards,
  getDiscussionBoardById,
  joinDiscussionBoard,
  unfollowDiscussionBoard,
  deleteDiscussionBoard,
  updateDiscussionBoard,
};
