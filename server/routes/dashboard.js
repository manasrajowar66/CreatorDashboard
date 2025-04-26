const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const FeedInteraction = require("../models/FeedInteraction");

router.get("/", async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  try {
    if (role === "admin") {
      const users = await User.find();
      const posts = await Post.find();
      const totalShared = await FeedInteraction.countDocuments({ action: 'shared' });

      const totalSaved = posts.filter((p) => p.action === "saved").length;
      const totalReported = posts.filter((p) => p.action === "reported").length;

      const userStats = users.map((user) => {
        const userPosts = posts.filter(
          (p) => p.userId.toString() === user._id.toString()
        );
        return {
          userId: user._id,
          email: user.email,
          role: user.role,
          credits: user.credits,
          saved: userPosts.filter((p) => p.action === "saved").length,
          reported: userPosts.filter((p) => p.action === "reported").length
        };
      });

      return res.json({
        totalUsers: users.length,
        totalSaved,
        totalReported,
        totalShared,
        userStats,
      });
    } else {
      const posts = await Post.find({ userId });
      const saved = posts.filter((p) => p.action === "saved");
      const reported = posts.filter((p) => p.action === "reported");

      // Fetching Recent Activities
      const recentActivities = await FeedInteraction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      return res.json({ saved, reported, recentActivities });
    }
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
