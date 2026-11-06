const express = require("express");
const router = express.Router();

const { getRating, rate } = require("../controller/ratingController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Public: anyone can view reviews for a title
router.get("/:mediaType/:tmdbId", getRating);

// Protected: user must be logged in to rate, review, or delete
router.use(authMiddleware);

router.post("/:mediaType/:tmdbId/rate", rate);

module.exports = router;
