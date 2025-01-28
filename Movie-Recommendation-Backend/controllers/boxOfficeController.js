const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const getCursorPaginationParams = require("../utils/pagination");

// Get Box Office and Awards Information with Pagination
const getBoxOfficeAndAwards = async (req, res) => {
  const { limit, query } = getCursorPaginationParams(req);

  try {
    const movies = await Movie.find(query)
      .select("title genre director cast boxOffice awardsAndNominations") // Select required fields
      .limit(limit)
      .sort({ _id: 1 }); // Sort by ID to support cursor-based pagination

    if (!movies.length) {
      return res.status(404).json({ message: "No movies found." });
    }

    // Modify the response to order fields: id, title, genre first, followed by director, cast, boxOffice, and awardsAndNominations
    const moviesWithOrderedFields = movies.map((movie) => {
      return {
        id: movie._id,
        title: movie.title,
        genre: movie.genre,
        director: {
          name: movie.director.name,
          biography: movie.director.biography,
          awards: movie.director.awards,
        },
        cast: movie.cast.map((actor) => ({
          name: actor.name,
          biography: actor.biography,
          awards: actor.awards,
        })),
        boxOffice: movie.boxOffice,
        awardsAndNominations: movie.awardsAndNominations,
      };
    });

    // Construct the response with pagination data
    const nextCursor = movies.length === limit ? movies[limit - 1]._id : null;

    res.status(200).json({
      data: moviesWithOrderedFields,
      pagination: {
        nextCursor,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching Box Office and Awards:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Box Office and Awards Information
const updateBoxOfficeAndAwards = async (req, res) => {
  const { movieId, boxOffice, awardsAndNominations, director, cast } = req.body;

  if (!movieId || !boxOffice || !awardsAndNominations) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if movieId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  try {
    // Find the movie by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Update the Box Office, Awards, Director, and Cast information
    movie.boxOffice = boxOffice;
    movie.awardsAndNominations = awardsAndNominations;
    if (director) {
      movie.director = director; // Update director if provided
    }
    if (cast) {
      movie.cast = cast; // Update cast if provided
    }

    // Save the updated movie document to the database
    await movie.save();

    // Send a successful response
    res.status(200).json({
      message: "Box Office and Awards updated successfully",
      data: movie,
    });
  } catch (error) {
    console.error("Error updating Box Office and Awards:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getBoxOfficeAndAwards,
  updateBoxOfficeAndAwards,
};
