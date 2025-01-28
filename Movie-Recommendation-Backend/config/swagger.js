const swaggerJsDoc = require("swagger-jsdoc");

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Recommendation System API",
      version: "1.0.0",
      description: "API documentation for the Movie Recommendation System",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply globally to all routes
      },
    ],
  },
  apis: ["./routes/*.js"], // Include your route files here
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
