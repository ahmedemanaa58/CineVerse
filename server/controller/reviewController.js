const Review = require("../models/Review");
const Rating = require("../models/Rating");
const mongoose = require("mongoose");
const isValidMedia = (mediaType, tmdbId) =>
  ["movie", "tv"].includes(mediaType) &&
  Number.isInteger(Number(tmdbId)) &&
  Number(tmdbId) > 0;

exports.getReviews = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.params;

    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({
        message: "Invalid media type or TMDB ID",
      });
    }

    // Pagination parameters
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const skip = (page - 1) * limit;

    // Retrieve reviews and total count
    const [reviews, totalReviews] = await Promise.all([
      Review.find({
        tmdbId: Number(tmdbId),
        mediaType,
      })
        .populate("user", "username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Review.countDocuments({
        tmdbId: Number(tmdbId),
        mediaType,
      }),
    ]);

    const totalPages = Math.ceil(totalReviews / limit);

    return res.status(200).json({
      message: "Reviews retrieved successfully",
      pagination: {
        totalReviews,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.addReview = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.params;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    const userId = req.user._id;
    const data = req.value;
    const addReview = await Review.create({
      ...data,
      tmdbId: Number(tmdbId),
      mediaType,
      user: userId,
    });
    const userRating = await Rating.findOne({
      user: userId,
      tmdbId,
      mediaType,
    }).select("rating");
    return res.status(201).json({
      message: "review added successfully ",
      addReview,
      rating: userRating ? userRating.rating : null,
    });
  } catch (error) {
    console.error("add review error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
exports.updateReview = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.params;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    //get review id
    const reviewId = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }
    //get review's data
    const data = req.value;
    //check if review exists?
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }
    // Verify that review belongs to requested media
    if (review.tmdbId !== Number(tmdbId) || review.mediaType !== mediaType) {
      return res.status(404).json({
        message: "Review not found for this media",
      });
    }
    //check if the user owns the review
    const userId = req.user._id;
    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "you can't update another user's review" });
    }
    //update review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { review: data.review },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.status(200).json({
      message: "review updated successfully",
      updatedReview,
    });
  } catch (error) {
    console.error("update review error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
exports.removeReview = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.params;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    //get review id
    const reviewId = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }
    //check if review exists?
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }
    // Verify that review belongs to requested media
    if (review.tmdbId !== Number(tmdbId) || review.mediaType !== mediaType) {
      return res.status(404).json({
        message: "Review not found for this media",
      });
    }
    //check if the user owns the review
    const userId = req.user._id;
    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "you can't delete another user's review" });
    }
    //delete review
    await Review.findByIdAndDelete(reviewId);
    return res.status(200).json({
      message: "review deleted successfully",
    });
  } catch (error) {
    console.error("remove review error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
