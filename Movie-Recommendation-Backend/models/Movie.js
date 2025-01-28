const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],
  director: {
    name: { type: String },
    biography: { type: String },
    filmography: [String],
    awards: [String],
    photos: [String],
  },
  cast: [
    {
      name: { type: String },
      biography: { type: String },
      filmography: [String],
      awards: [String],
      photos: [String],
    },
  ],
  releaseDate: Date,
  releaseYear: Number,
  releaseDecade: String,
  countryOfOrigin: String,
  language: String,
  originalTitle: String,
  runtime: Number,
  synopsis: String,
  averageRating: Number,
  movieCoverPhoto: String,
  trivia: [String],
  goofs: [String],
  soundtrack: [String],
  composer: String,
  parentalGuidance: {
    rating: { type: String },
    description: { type: String },
    examples: [String],
  },
  popularity: { type: Number },
  ratings: {
    IMDb: Number,
    RottenTomatoes: Number,
    Metacritic: Number,
    AudienceScore: Number,
  },
  keywords: [String],
  tags: [String],
  newsAndArticles: [
    {
      title: String,
      date: Date,
      summary: String,
      link: String,
    },
  ],
  boxOffice: {
    openingWeekendEarnings: Number,
    totalEarnings: Number,
    domesticRevenue: Number,
    internationalRevenue: Number,
    budget: Number,
    worldwideGross: Number,
  },
  awardsAndNominations: [
    {
      award: String,
      category: String,
      result: String,
      year: Number,
    },
  ],
  relatedMovies: [
    {
      title: String,
      year: Number,
      genre: String,
      director: String,
      rating: Number,
      synopsis: String,
    },
  ],
  streamingPlatforms: [String],
  posterImages: [String],
  behindTheScenesPhotos: [String],
  sequels: [
    {
      title: String,
      releaseYear: Number,
      synopsis: String,
    },
  ],
  prequels: [
    {
      title: String,
      releaseYear: Number,
      synopsis: String,
    },
  ],
  filmingLocations: [String],
  filmmakingTechniques: [String], // e.g., IMAX, 3D, CGI effects, etc.
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
