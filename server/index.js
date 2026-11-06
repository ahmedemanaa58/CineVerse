const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectToDatabase } = require("./config/dbConfig");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("CineVerse API is running!");
});

//api routes
app.use("/api/auth", require("./routes/authRoutes.js"));

const movieRoutes = require("./routes/movieRoute");
app.use("/api/movies", movieRoutes);
const libraryRoutes = require("./routes/libraryRoutes"); // adjust path/name if needed

app.use("/api/library", libraryRoutes);

const ratingRoutes = require("./routes/ratingRoutes");
app.use("/api/ratings", ratingRoutes);

const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/reviews", reviewRoutes);
// Start server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
