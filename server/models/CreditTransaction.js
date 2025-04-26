const mongoose = require("mongoose");

const creditTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String, // e.g., 'login', 'profile_complete', 'feed_save'
  points: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CreditTransaction", creditTransactionSchema);
