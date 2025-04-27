const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const UserActivity = require("../models/UserActivity");

router.get("/", async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  try {
    if (role === "admin") {
      const users = await User.find({ role: "user" });
      const posts = await Post.find();
      const totalShared = await UserActivity.countDocuments({ type: "share" });

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
          reported: userPosts.filter((p) => p.action === "reported").length,
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

      // Filter the saved and reported posts from the fetched posts
      const saved = posts.filter((post) => post.action === "saved").slice(0, 5);
      const reported = posts
        .filter((post) => post.action === "reported")
        .slice(0, 5);

      // Get total count of saved and reported posts
      const totalSavedPostCount = posts.filter(
        (post) => post.action === "saved"
      ).length;
      const totalReportedPostCount = posts.filter(
        (post) => post.action === "reported"
      ).length;

      // Fetching Recent Activities
      const recentActivities = await UserActivity.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      return res.status(200).json({
        totalSavedPostCount,
        totalReportedPostCount,
        savedPosts: saved,
        reportedPosts: reported,
        recentActivities,
      });
    }
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
