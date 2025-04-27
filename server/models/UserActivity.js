const mongoose = require("mongoose");

// Define the schema for UserActivity
const userActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    postId: { type: String, default: null },
    extraInfo: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

// Create the model for UserActivity
const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
