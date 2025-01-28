const Reply = require("../models/Reply");
const User = require("../models/User");

exports.createReply = async (req, res) => {
  try {
    const { content, postId } = req.body;

    const reply = new Reply({
      content,
      author: req.user.id,
      post: postId,
    });

    await reply.save();
    return res.status(201).json({ message: "Reply created", reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
