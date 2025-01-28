const mongoose = require("mongoose");

const trailerSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: false, // Removed required validation
    }, // Ref to Movie model
    trailerName: {
      type: String,
      required: true, // Name or title of the trailer
    },
    trailerUrl: {
      type: String,
      required: true,
    },
    trailerType: {
      type: String,
      enum: ["Official", "Teaser", "Behind the Scenes", "Fan Made"],
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // Duration in seconds
    },
    description: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
    regionRestrictions: [String], // Countries/Regions where trailer is available
    isPublic: {
      type: Boolean,
      default: true,
    }, // Whether the trailer is public or private
  },
  { timestamps: true }
);

const Trailer = mongoose.model("Trailer", trailerSchema);

module.exports = Trailer;
