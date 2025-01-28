const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import uuid to generate unique ids

const customListSchema = new mongoose.Schema(
  {
    customId: { type: String, default: uuidv4, unique: true }, // Generate a unique customId
    name: { type: String, required: true },
    description: { type: String },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPublic: { type: Boolean, default: true },
    shareableLink: { type: String, unique: true }, // Add shareableLink field
  },
  { timestamps: true }
);

// Pre-save hook to generate shareable link when the list is made public
customListSchema.pre("save", function (next) {
  if (this.isPublic && !this.shareableLink) {
    this.shareableLink = `https://yourdomain.com/custom-list/${this.customId}`;
  }
  next();
});

const CustomList = mongoose.model("CustomList", customListSchema);

module.exports = CustomList;
