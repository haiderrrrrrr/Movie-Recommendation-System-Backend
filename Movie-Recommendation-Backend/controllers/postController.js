const Post = require("../models/Post");
const CommentPost = require("../models/CommentPost");
const LikePost = require("../models/LikePost");
const DiscussionBoard = require("../models/DiscussionBoard");
const getCursorPaginationParams = require("../utils/pagination");

// Create a new post in a discussion board
const createPost = async (req, res) => {
  const { content, discussionBoardId } = req.body;
  const userId = req.user.id;

  if (!content || !discussionBoardId) {
    return res
      .status(400)
      .json({ error: "Content and DiscussionBoardId are required." });
  }

  try {
    const board = await DiscussionBoard.findById(discussionBoardId);
    if (!board) {
      return res.status(404).json({ error: "Discussion board not found." });
    }

    if (!board.participants.includes(userId)) {
      return res.status(403).json({
        error: "You must be following the discussion board to create a post.",
      });
    }

    const newPost = new Post({
      content,
      author: userId,
      discussionBoard: discussionBoardId,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a post
const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ error: "Content is required for update." });
  }

  try {
    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ error: "Post not found." });

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own posts." });
    }

    post.content = content;
    await post.save();

    res.status(200).json({ message: "Post updated successfully", data: post });
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found." });

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own posts." });
    }

    await post.deleteOne(); // Use deleteOne instead of remove
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all posts for a discussion board with pagination
const getPostsForDiscussionBoard = async (req, res) => {
  const { discussionBoardId } = req.params;
  const { limit, query } = getCursorPaginationParams(req);

  try {
    const posts = await Post.find({
      discussionBoard: discussionBoardId,
      ...query,
    })
      .limit(limit)
      .populate("author", "username")
      .sort({ createdAt: -1 });

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].postId : null;

    res.status(200).json({
      posts,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findOne({ postId }).populate("author", "username");

    if (!post) return res.status(404).json({ error: "Post not found." });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a comment to a post
const addCommentToPost = async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id;

  if (!postId || !content) {
    return res.status(400).json({ error: "PostId and content are required." });
  }

  try {
    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const newComment = new CommentPost({
      content,
      author: userId,
      post: post._id, // Use the MongoDB _id for association
    });

    await newComment.save();
    res
      .status(201)
      .json({ message: "Comment added successfully", data: newComment });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Like a post
const likePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  if (!postId) {
    return res.status(400).json({ error: "PostId is required." });
  }

  try {
    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const existingLike = await LikePost.findOne({
      user: userId,
      post: post._id,
    });

    if (existingLike) {
      return res.status(400).json({ error: "You already liked this post." });
    }

    const newLike = new LikePost({
      user: userId,
      post: post._id,
    });

    await newLike.save();
    res.status(201).json({ message: "Post liked successfully", data: newLike });
  } catch (error) {
    console.error("Error liking post:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  if (!postId) {
    return res.status(400).json({ error: "PostId is required." });
  }

  try {
    const like = await LikePost.findOneAndDelete({
      user: userId,
      post: postId,
    });

    if (!like) {
      return res.status(404).json({ error: "Like not found." });
    }

    res.status(200).json({ message: "Post unliked successfully." });
  } catch (error) {
    console.error("Error unliking post:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get comments for a post with pagination
const getCommentsForPost = async (req, res) => {
  const { postId } = req.params;
  const { limit, query } = getCursorPaginationParams(req);

  try {
    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const comments = await CommentPost.find({ post: post._id, ...query })
      .limit(limit)
      .populate("author", "username")
      .sort({ createdAt: -1 });

    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1]._id : null;

    res.status(200).json({
      comments,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostsForDiscussionBoard,
  getPostById,
  addCommentToPost,
  likePost,
  unlikePost,
  getCommentsForPost,
};
