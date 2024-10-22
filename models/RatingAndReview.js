const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.model({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
