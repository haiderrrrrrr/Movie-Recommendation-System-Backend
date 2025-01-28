const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Extract token from the "Authorization" header (expected format: "Bearer <token>")
  const token = req.header("Authorization")?.split(" ")[1];
  
  // If no token is provided, send Unauthorized response
  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    // Verify the token using JWT_SECRET (ensure this environment variable is set)
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = verified;

    // Log the user info for debugging (can be removed in production)
    console.log(req.user);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid, return a 400 response
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
