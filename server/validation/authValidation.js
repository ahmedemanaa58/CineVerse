const joi = require("joi");

//login
exports.loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});
//register
exports.registerSchema = joi.object({
  username: joi.string().trim().min(3).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});
