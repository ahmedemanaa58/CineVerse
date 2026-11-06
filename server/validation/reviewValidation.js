const Joi = require("joi");

const reviewSchema = Joi.object({
  review: Joi.string().trim().min(5).max(150).required(),
});

module.exports = { reviewSchema };
