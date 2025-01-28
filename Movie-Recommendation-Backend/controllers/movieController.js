const Movie = require("../models/Movie");
const getCursorPaginationParams = require("../utils/pagination"); // Import pagination utility

// Get Movies (With Cursor-Based Pagination)
const getMovies = async (req, res) => {
  // Restrict access to admins only
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { limit, query } = getCursorPaginationParams(req);

  try {
    const movies = await Movie.find(query).limit(limit);
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    // Map the movies to ensure movieId and title appear first
    const formattedMovies = movies.map((movie) => {
      const formattedMovie = movie.toObject(); // Convert the Mongoose document to a plain JavaScript object

      // Map _id to id and remove _id if needed
      const { _id, title, ...otherFields } = formattedMovie; // Destructure to bring 'movieId' and 'title' first
      const formattedMovieWithOrder = { id: _id, title, ...otherFields }; // 'id' comes first

      // Ensure the director field is in the correct format (with 'id' instead of '_id')
      if (formattedMovieWithOrder.director) {
        formattedMovieWithOrder.director.id =
          formattedMovieWithOrder.director._id;
        delete formattedMovieWithOrder.director._id;
      }

      // Ensure the cast members are also formatted correctly
      if (formattedMovieWithOrder.cast) {
        formattedMovieWithOrder.cast = formattedMovieWithOrder.cast.map(
          (castMember) => {
            castMember.id = castMember._id;
            delete castMember._id;
            return castMember;
          }
        );
      }

      // Add new fields from the updated schema (if any)
      if (formattedMovieWithOrder.ratings) {
        formattedMovieWithOrder.ratings = {
          IMDb: formattedMovieWithOrder.ratings.IMDb,
          RottenTomatoes: formattedMovieWithOrder.ratings.RottenTomatoes,
          Metacritic: formattedMovieWithOrder.ratings.Metacritic,
          AudienceScore: formattedMovieWithOrder.ratings.AudienceScore,
        };
      }

      return formattedMovieWithOrder;
    });

    res.status(200).json({
      nextCursor,
      movies: formattedMovies,
    });
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Add Movie (Admin Only with Duplicate Check)
const addMovie = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const {
    title,
    genre,
    director,
    cast,
    releaseDate,
    releaseYear,
    releaseDecade,
    countryOfOrigin,
    language,
    originalTitle,
    runtime,
    synopsis,
    averageRating,
    movieCoverPhoto,
    trivia,
    goofs,
    soundtrack,
    composer,
    parentalGuidance,
    popularity,
    ratings,
    keywords,
    tags,
    newsAndArticles,
    boxOffice,
    awardsAndNominations,
    relatedMovies,
    streamingPlatforms,
    posterImages,
    behindTheScenesPhotos,
    sequels,
    prequels,
    filmingLocations,
    filmmakingTechniques,
  } = req.body;

  try {
    // Check if the movie already exists by title
    const existingMovie = await Movie.findOne({ title });

    if (existingMovie) {
      return res
        .status(400)
        .json({ error: "Movie already exists in the database" });
    }

    // Create a new movie document
    const newMovie = new Movie({
      title,
      genre,
      director,
      cast,
      releaseDate,
      releaseYear,
      releaseDecade,
      countryOfOrigin,
      language,
      originalTitle,
      runtime,
      synopsis,
      averageRating,
      movieCoverPhoto,
      trivia,
      goofs,
      soundtrack,
      composer,
      parentalGuidance,
      popularity,
      ratings,
      keywords,
      tags,
      newsAndArticles,
      boxOffice,
      awardsAndNominations,
      relatedMovies,
      streamingPlatforms,
      posterImages,
      behindTheScenesPhotos,
      sequels,
      prequels,
      filmingLocations,
      filmmakingTechniques,
    });

    // Save the new movie to the database
    await newMovie.save();

    res
      .status(201)
      .json({ message: "Movie added successfully", movie: newMovie });
  } catch (error) {
    console.error("Error adding movie:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Movie (Admin Only)
const updateMovie = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie)
      return res.status(404).json({ error: "Movie not found" });

    res
      .status(200)
      .json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    console.error("Error updating movie:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Movie (Admin Only)
const deleteMovie = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ error: "Movie not found" });

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovies,
};
