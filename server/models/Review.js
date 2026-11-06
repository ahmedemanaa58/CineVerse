const { Schema, model, Types } = require("mongoose");

const reviewSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
    },
  },
  { timestamps: true },
);

module.exports = model("Review", reviewSchema);
