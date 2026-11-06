const User = require("../models/User");

const isValidMedia = (mediaType, tmdbId) =>
  ["movie", "tv"].includes(mediaType) &&
  Number.isInteger(Number(tmdbId)) &&
  Number(tmdbId) > 0;

exports.getLibrary = async function (req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("watchList favourites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const watchList = user.watchList || [];
    const favourites = user.favourites || [];

    if (watchList.length === 0 && favourites.length === 0) {
      return res.status(200).json({
        message: "Your library is empty",
        watchList,
        favourites,
      });
    }

    return res.status(200).json({ watchList, favourites });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.addToWatchList = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.body;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          watchList: {
            tmdbId: Number(tmdbId),
            mediaType,
          },
        },
      },
      { new: true, runValidators: true },
    ).select("watchList");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({
      message: "Added to watchlist",
      watchList: user.watchList,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
exports.removeFromWatchList = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.params;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    const userID = req.user._id;
    const user = await User.findByIdAndUpdate(
      userID,
      {
        $pull: {
          watchList: {
            tmdbId: Number(tmdbId),
            mediaType,
          },
        },
      },
      { new: true, runValidators: true },
    ).select("watchList");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({
      message: "item removed from the watchlist successfully",
      watchList: user.watchList,
    });
  } catch (error) {
    console.error("removeFromWatchList error:", error);
    return res.status(500).json({ message: error.message });
  }
};
exports.addToFavorites = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.body;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          favourites: {
            tmdbId: Number(tmdbId),
            mediaType,
          },
        },
      },
      { new: true, runValidators: true },
    ).select("favourites");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res
      .status(200)
      .json({ message: "Added to favourites", favourites: user.favourites });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
exports.removeFromFavorites = async function (req, res) {
  try {
    const { tmdbId, mediaType } = req.params;
    if (!isValidMedia(mediaType, tmdbId)) {
      return res.status(400).json({ message: "Invalid media type or TMDB ID" });
    }
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          favourites: {
            tmdbId: Number(tmdbId),
            mediaType,
          },
        },
      },
      { new: true, runValidators: true },
    ).select("favourites");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({
      message: "removed from the favourites!",
      favourites: user.favourites,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
