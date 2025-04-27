const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { saveNotification } = require("../controllers/notification");
const { NotificationType } = require("../utils/utils");

router.get("/:type", async (req, res) => {
  try {
    const user = req.user;
    const { type } = req.params;
    const posts = await Post.find({ userId: user._id, action: type });

    return res.status(200).json({
      message: "Posts fetch successfully",
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/save", async (req, res) => {
  try {
    const { title, link, source } = req.body;
    const user = req.user;
    const post = await Post.create({
      title,
      link,
      source,
      userId: user._id,
      action: "saved",
    });

    saveNotification({
      userId: user._id,
      type: NotificationType.POST_SAVE,
    });

    res.status(201).json({ message: "Post saved successfully", post });
  } catch (err) {
    res.status(400).json({ error: "Failed to save post" });
  }
});

router.post("/report", async (req, res) => {
  try {
    const { title, link, source } = req.body;
    const user = req.user;
    const post = await Post.create({
      title,
      link,
      source,
      userId: user._id,
      action: "reported",
    });

    saveNotification({
      userId: user._id,
      type: NotificationType.POST_REPORT,
    });
    res.status(201).json({ message: "Post reported successfully", post });
  } catch (err) {
    res.status(400).json({ error: "Failed to report post" });
  }
});

router.post("/share", async (req, res) => {
  try {
    const user = req.user;

    saveNotification({
      userId: user._id,
      type: NotificationType.POST_SHARE,
    });

    res
      .status(201)
      .json({ message: "Post shared activity logged successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to report post" });
  }
});

module.exports = router;
