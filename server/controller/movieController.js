const tmdb = require("../services/tmdbService");

exports.search = async function (req, res) {
  try {
    const { query, type = "movie" } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    if (!["movie", "tv"].includes(type)) {
      return res.status(400).json({
        message: "Type must be 'movie' or 'tv'",
      });
    }

    const response = await tmdb.get(`/search/${type}`, {
      params: { query: query.trim() },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("TMDB search error:", error.response?.data || error.message);

    return res.status(502).json({
      message: "Could not search TMDB",
    });
  }
};
exports.getDetails = async function (req, res) {
  try {
    const { id } = req.params;
    const { type = "movie" } = req.query;

    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({ message: "A valid TMDB ID is required" });
    }

    if (!["movie", "tv"].includes(type)) {
      return res.status(400).json({
        message: "Type must be 'movie' or 'tv'",
      });
    }

    const response = await tmdb.get(`/${type}/${id}`);

    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Movie or TV show not found" });
    }

    console.error("TMDB details error:", error.response?.data || error.message);
    return res.status(502).json({ message: "Could not get details from TMDB" });
  }
};


exports.getTrending = async function (req, res) {
  try {
    const response = await tmdb.get("/trending/all/week");
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("TMDB trending error:", error.response?.data || error.message);
    return res.status(502).json({ message: "Could not get trending titles from TMDB" });
  }
};
