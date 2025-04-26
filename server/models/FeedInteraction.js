const mongoose = require("mongoose");

const FeedInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  action: {
    type: String,
    enum: ["saved", "reported", "shared"],
    required: true,
  },
  source: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FeedInteraction", FeedInteractionSchema);
