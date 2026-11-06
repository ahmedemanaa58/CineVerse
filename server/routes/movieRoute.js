const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");

router.get("/trending", movieController.getTrending);
router.get("/search", movieController.search);
router.get("/:id", movieController.getDetails);

module.exports = router;
