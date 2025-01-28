const Trailer = require("../models/Trailer");
const getCursorPaginationParams = require("../utils/pagination");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Create transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "haiderch6072@gmail.com",
    pass: "ikvm amst zsxf coym",
  },
});

// Helper function to send email
const sendEmail = (toEmail, subject, html) => {
  const mailOptions = {
    from: "haiderch6072@gmail.com",
    to: toEmail,
    subject,
    html, // Use HTML for better formatting
  };

  return transporter.sendMail(mailOptions);
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
};

// Create a new trailer (Admin Only)
const createTrailer = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const {
    movieId,
    trailerName,
    trailerUrl,
    trailerType,
    releaseDate,
    duration,
    description,
    language,
    regionRestrictions,
    isPublic,
  } = req.body;

  try {
    if (
      !trailerName ||
      !trailerUrl ||
      !trailerType ||
      !releaseDate ||
      !duration ||
      !description
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingTrailer = await Trailer.findOne({ movieId, trailerUrl });
    if (existingTrailer) {
      return res.status(400).json({
        error: "This trailer already exists for the specified movie.",
      });
    }

    const newTrailer = new Trailer({
      movieId,
      trailerName,
      trailerUrl,
      trailerType,
      releaseDate,
      duration,
      description,
      language,
      regionRestrictions,
      isPublic,
    });

    await newTrailer.save();
    res
      .status(201)
      .json({ message: "Trailer created successfully", data: newTrailer });
  } catch (error) {
    console.error("Error creating trailer:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get trailers with pagination (Accessible to all users)
const getTrailers = async (req, res) => {
  const { limit, query } = getCursorPaginationParams(req);

  try {
    const trailers = await Trailer.find(query)
      .limit(limit)
      .populate("movieId", "title genre releaseDate")
      .exec();

    if (!trailers.length) {
      return res.status(404).json({ message: "No trailers found" });
    }

    res.status(200).json({ trailers });
  } catch (error) {
    console.error("Error fetching trailers:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a specific trailer by ID (Accessible to all users)
const getTrailerById = async (req, res) => {
  const { id } = req.params;

  try {
    const trailer = await Trailer.findById(id).populate(
      "movieId",
      "title genre releaseDate"
    );
    if (!trailer) {
      return res.status(404).json({ error: "Trailer not found" });
    }

    res.status(200).json({ trailer });
  } catch (error) {
    console.error("Error fetching trailer:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a trailer (Admin Only)
const updateTrailer = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { id } = req.params;
  const {
    trailerName,
    trailerUrl,
    trailerType,
    releaseDate,
    duration,
    description,
    language,
    regionRestrictions,
    isPublic,
  } = req.body;

  try {
    const trailer = await Trailer.findById(id);
    if (!trailer) {
      return res.status(404).json({ error: "Trailer not found" });
    }

    trailer.trailerName = trailerName || trailer.trailerName;
    trailer.trailerUrl = trailerUrl || trailer.trailerUrl;
    trailer.trailerType = trailerType || trailer.trailerType;
    trailer.releaseDate = releaseDate || trailer.releaseDate;
    trailer.duration = duration || trailer.duration;
    trailer.description = description || trailer.description;
    trailer.language = language || trailer.language;
    trailer.regionRestrictions =
      regionRestrictions || trailer.regionRestrictions;
    trailer.isPublic = isPublic !== undefined ? isPublic : trailer.isPublic;

    await trailer.save();
    res
      .status(200)
      .json({ message: "Trailer updated successfully", data: trailer });
  } catch (error) {
    console.error("Error updating trailer:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a trailer (Admin Only)
const deleteTrailer = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { id } = req.params;

  try {
    const trailer = await Trailer.findById(id);
    if (!trailer) {
      return res.status(404).json({ error: "Trailer not found" });
    }

    await trailer.deleteOne();
    res.status(200).json({ message: "Trailer deleted successfully" });
  } catch (error) {
    console.error("Error deleting trailer:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Share trailer via email (Accessible to all users)
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Add this in your .env file
const authToken = process.env.TWILIO_AUTH_TOKEN; // Add this in your .env file
const client = twilio(accountSid, authToken); // Initialize the Twilio client

// Share trailer via email, WhatsApp, and SMS (Accessible to all users)
const shareTrailer = async (req, res) => {
  const { trailerId, email, message, whatsapp, sms } = req.body;

  try {
    const trailer = await Trailer.findById(trailerId).populate(
      "movieId",
      "title"
    );
    if (!trailer) {
      return res.status(404).json({ error: "Trailer not found" });
    }

    const movieTitle = trailer.movieId ? trailer.movieId.title : "a trailer";

    // Construct the detailed trailer message in HTML
    const shareMessage = `
      <h3>${message || "Check out this amazing trailer!"}</h3>
      <p><strong>Trailer Name:</strong> ${trailer.trailerName}</p>
      <p><strong>Movie Title:</strong> ${movieTitle}</p>
      <p><strong>Type:</strong> ${trailer.trailerType}</p>
      <p><strong>Release Date:</strong> ${new Date(
        trailer.releaseDate
      ).toLocaleDateString()}</p>
      <p><strong>Duration:</strong> ${trailer.duration} seconds</p>
      <p><strong>Description:</strong> ${trailer.description}</p>
      <p><strong>Language:</strong> ${trailer.language || "Not specified"}</p>
      <p><strong>Trailer URL:</strong> <a href="${
        trailer.trailerUrl
      }" target="_blank">${trailer.trailerUrl}</a></p>
      <p><strong>More Details:</strong> <a href="http://localhost:5000/api/trailers/${
        trailer._id
      }" target="_blank">View Trailer Details</a></p>
    `;

    // Send email
    if (email) {
      await sendEmail(email, `Check out ${trailer.trailerName}`, shareMessage);
      console.log(`Email sent to ${email}`);
    }

    // Send WhatsApp message
    if (whatsapp) {
      const whatsappMessage = `
      *${message || "Check out this amazing trailer!"}*\n\n
      *Trailer Name:* ${trailer.trailerName}\n
      *Movie Title:* ${movieTitle}\n
      *Type:* ${trailer.trailerType}\n
      *Release Date:* ${new Date(trailer.releaseDate).toLocaleDateString()}\n
      *Duration:* ${trailer.duration} seconds\n
      *Description:* ${trailer.description}\n
      *Language:* ${trailer.language || "Not specified"}\n
      *Trailer URL:* ${trailer.trailerUrl}\n
      *More Details:* http://localhost:5000/api/trailers/${trailer._id}
      `;

      await client.messages.create({
        body: whatsappMessage,
        from: "whatsapp:+14155238886", // Twilio WhatsApp number
        to: `whatsapp:${whatsapp}`, // Recipient's WhatsApp number
      });
      console.log(`WhatsApp message sent to ${whatsapp}`);
    }

    // Send SMS message
    if (sms) {
      const smsMessage = `
      Check out this amazing trailer!\n
      Trailer Name: ${trailer.trailerName}\n
      Movie Title: ${movieTitle}\n
      Type: ${trailer.trailerType}\n
      Release Date: ${new Date(trailer.releaseDate).toLocaleDateString()}\n
      Duration: ${trailer.duration} seconds\n
      Description: ${trailer.description}\n
      Language: ${trailer.language || "Not specified"}\n
      Trailer URL: ${trailer.trailerUrl}\n
      More Details: http://localhost:5000/api/trailers/${trailer._id}
      `;

      await client.messages.create({
        body: smsMessage,
        from: "+19543887620", // Twilio SMS number
        to: sms, // Recipient's phone number for SMS
      });
      console.log(`SMS message sent to ${sms}`);
    }

    res.status(200).json({
      message: "Trailer shared via email, WhatsApp, and SMS",
    });
  } catch (error) {
    console.error("Error sharing trailer:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createTrailer,
  getTrailers,
  getTrailerById,
  updateTrailer,
  deleteTrailer,
  shareTrailer,
};
