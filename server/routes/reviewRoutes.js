const express = require("express");
const router = express.Router();

const {
  getReviews,
  addReview,
  updateReview,
  removeReview,
} = require("../controller/reviewController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { validateMiddleware } = require("../middleware/validatorMiddleware");
const { reviewSchema } = require("../validation/reviewValidation");

// Public: get reviews for a movie or TV show
router.get("/:mediaType/:tmdbId", getReviews);

// Protected routes
router.use(authMiddleware);

// Create review
router.post("/:mediaType/:tmdbId", validateMiddleware(reviewSchema), addReview);

// Update review
router.patch(
  "/:mediaType/:tmdbId/:id",
  validateMiddleware(reviewSchema),
  updateReview,
);

// Delete review
router.delete("/:mediaType/:tmdbId/:id", removeReview);;

module.exports = router;
