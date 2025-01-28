const Movie = require("../models/Movie");
const getCursorPaginationParams = require("../utils/pagination");

// Search and Filter Movies
const searchMovies = async (req, res) => {
  try {
    const { limit, query: paginationQuery } = getCursorPaginationParams(req);
    const {
      search, // Search by title, genre, director, actors
      genre,
      ratingMin,
      ratingMax,
      popularityMin,
      popularityMax,
      releaseYear,
      releaseDecade,
      runtimeMin,
      runtimeMax,
      parentalRating,
      actor, // Search by actor
      keywords, // Search by keywords
      countryOfOrigin, // Filter by country of origin
      language, // Filter by language
      boxOfficeMin, // Filter by minimum box office earnings
      boxOfficeMax, // Filter by maximum box office earnings
      awards, // Filter by specific awards
      streamingPlatform, // Filter by streaming platforms
      filmingLocation, // Filter by filming locations
      filmmakingTechnique, // Filter by filmmaking techniques like IMAX, 3D, etc.
      trending, // Combine popularity and release date for trending movies
    } = req.query;

    // Build search and filter conditions
    const query = { ...paginationQuery };

    // Search by text (title, genre, director, actors)
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { genre: new RegExp(search, "i") },
        { "director.name": new RegExp(search, "i") },
        { "cast.name": new RegExp(search, "i") },
      ];
    }

    // Filter by genre
    if (genre) {
      query.genre = { $in: genre.split(",") };
    }

    // Filter by rating range
    if (ratingMin || ratingMax) {
      query.averageRating = {};
      if (ratingMin) query.averageRating.$gte = parseFloat(ratingMin);
      if (ratingMax) query.averageRating.$lte = parseFloat(ratingMax);
    }

    // Filter by popularity range
    if (popularityMin || popularityMax) {
      query.popularity = {};
      if (popularityMin) query.popularity.$gte = parseInt(popularityMin);
      if (popularityMax) query.popularity.$lte = parseInt(popularityMax);
    }

    // Filter by release year or decade
    if (releaseYear) {
      query.releaseDate = {
        $gte: new Date(`${releaseYear}-01-01`),
        $lte: new Date(`${releaseYear}-12-31`),
      };
    } else if (releaseDecade) {
      const startYear = parseInt(releaseDecade);
      const endYear = startYear + 9;
      query.releaseDate = {
        $gte: new Date(`${startYear}-01-01`),
        $lte: new Date(`${endYear}-12-31`),
      };
    }

    // Filter by runtime
    if (runtimeMin || runtimeMax) {
      query.runtime = {};
      if (runtimeMin) query.runtime.$gte = parseInt(runtimeMin);
      if (runtimeMax) query.runtime.$lte = parseInt(runtimeMax);
    }

    // Filter by parental guidance rating
    if (parentalRating) {
      query["parentalGuidance.rating"] = new RegExp(parentalRating, "i");
    }

    // Filter by specific actor
    if (actor) {
      query["cast.name"] = new RegExp(actor, "i");
    }

    // Filter by keywords (e.g., "based on a true story")
    if (keywords) {
      query.keywords = { $in: keywords.split(",") };
    }

    // Filter by country of origin
    if (countryOfOrigin) {
      query.countryOfOrigin = new RegExp(countryOfOrigin, "i");
    }

    // Filter by language
    if (language) {
      query.language = new RegExp(language, "i");
    }

    // Filter by box office earnings
    if (boxOfficeMin || boxOfficeMax) {
      query.boxOffice = {};
      if (boxOfficeMin)
        query.boxOffice.totalEarnings = { $gte: parseFloat(boxOfficeMin) };
      if (boxOfficeMax)
        query.boxOffice.totalEarnings = { $lte: parseFloat(boxOfficeMax) };
    }

    // Filter by awards
    if (awards) {
      query.awardsAndNominations = {
        $elemMatch: { award: { $in: awards.split(",") } },
      };
    }

    // Filter by streaming platforms
    if (streamingPlatform) {
      query.streamingPlatforms = { $in: streamingPlatform.split(",") };
    }

    // Filter by filming location
    if (filmingLocation) {
      query.filmingLocations = { $in: filmingLocation.split(",") };
    }

    // Filter by filmmaking technique (IMAX, 3D, etc.)
    if (filmmakingTechnique) {
      query.filmmakingTechniques = { $in: filmmakingTechnique.split(",") };
    }

    // Trending filter (combining popularity and release date)
    if (trending) {
      query.popularity = { $gte: 50 }; // Example filter: Popularity greater than 50
      query.releaseDate = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      }; // Released in the last month
    }

    // Fetch filtered movies
    const movies = await Movie.find(query).limit(limit);
    const nextCursor = movies.length > 0 ? movies[movies.length - 1]._id : null;

    res.status(200).json({ nextCursor, movies });
  } catch (error) {
    console.error("Error searching movies:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Top Movies by Genre
const getTopMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.query;

    if (!genre) {
      return res
        .status(400)
        .json({ error: "Genre is required for filtering." });
    }

    const movies = await Movie.find({ genre: { $in: genre.split(",") } })
      .sort({ averageRating: -1 })
      .limit(10);

    res.status(200).json({ genre, movies });
  } catch (error) {
    console.error("Error fetching top movies by genre:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


// Top Movies of the Month
const getTopMoviesOfTheMonth = async (req, res) => {
  try {
    const { limit = 10 } = req.query; // Optional limit for number of movies

    const movies = await Movie.find({})
      .sort({
        averageRating: -1, // Sort by average rating (descending)
        popularity: -1, // Sort by popularity (descending)
        boxOffice: -1, // Sort by box office earnings (descending)
      })
      .limit(parseInt(limit)); // Limit the results

    if (movies.length === 0) {
      return res.status(404).json({ message: "No top movies found." });
    }

    res.status(200).json({ movies });
  } catch (error) {
    console.error("Error fetching top movies of the month:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { searchMovies, getTopMoviesByGenre, getTopMoviesOfTheMonth };
