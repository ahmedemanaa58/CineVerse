const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    watchList: [
      {
        tmdbId: { type: Number, required: true },
        mediaType: { type: String, enum: ["movie", "tv"], required: true },
      },
    ],
    favourites: [
      {
        tmdbId: { type: Number, required: true },
        mediaType: { type: String, enum: ["movie", "tv"], required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = model("User", userSchema);
