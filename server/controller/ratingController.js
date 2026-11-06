const Rating = require("../models/Rating");

const isValidMedia = (mediaType, tmdbId) =>
  ["movie", "tv"].includes(mediaType) &&
  Number.isInteger(Number(tmdbId)) &&
  Number(tmdbId) > 0;

exports.getRating = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.params;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    const ratings = await Rating.find({
      tmdbId: Number(tmdbId),
      mediaType,
    })
      .select("user rating review createdAt")
      .populate("user", "username");
    if (ratings.length === 0) {
      return res
        .status(404)
        .json({ ratings: [], averageRating: null, ratingCount: 0 });
    }
    //calculate average rating
    const ratedItems = ratings.filter((item) => item.rating !== undefined);

    const averageRating = ratedItems.length
      ? ratedItems.reduce((sum, item) => sum + item.rating, 0) /
        ratedItems.length
      : null;

    const ratingCount = ratedItems.length;

    return res.status(200).json({
      ratings,
      averageRating:
        averageRating === null ? null : Number(averageRating.toFixed(1)),
      ratingCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
exports.rate = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.params;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    //get user
    const user = req.user._id;
    const { rating } = req.body;
    const updatedRating = await Rating.findOneAndUpdate(
      {
        user,
        tmdbId: Number(tmdbId),
        mediaType,
      },
      { $set: { rating } },
      { new: true, upsert: true, runValidators: true },
    );
    return res.status(200).json({
      message: "rating saved successfully",
      rating: updatedRating,
    });
  } catch (error) {
    console.error("rate error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

