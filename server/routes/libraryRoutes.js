const express = require("express");
const router = express.Router();

const {
  getLibrary,
  addToWatchList,
  removeFromWatchList,
  addToFavorites,
  removeFromFavorites,
} = require("../controller/libraryController");

// Change this import/name to match your existing auth middleware.
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.get("/", getLibrary);

router.post("/watchlist", addToWatchList);
router.delete("/watchlist/:mediaType/:tmdbId", removeFromWatchList);

router.post("/favourites", addToFavorites);
router.delete("/favourites/:mediaType/:tmdbId", removeFromFavorites);

module.exports = router;
