const Joi = require("joi");

const ratingSchema = Joi.object({
  tmdbId: Joi.number().integer().positive().required(),
  mediaType: Joi.string().valid("movie", "tv").required(),

  // Optional, but if provided must be an integer from 0 to 10
  rating: Joi.number().integer().min(0).max(10).optional(),


});

module.exports = { ratingSchema };
