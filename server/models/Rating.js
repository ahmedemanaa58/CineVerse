const { Schema, model, Types } = require("mongoose");

const ratingSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ["movie", "tv"], required: true },
    rating: { type: Number, min: 0, max: 10 },
   
  },
  { timestamps: true },
);
ratingSchema.index({ user: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

ratingSchema.pre("validate", function (next) {
  if (this.rating == null && !this.review?.trim()) {
    return next(new Error("Please provide a rating or a review."));
  }

  next();
});
module.exports = model("Rating", ratingSchema);
