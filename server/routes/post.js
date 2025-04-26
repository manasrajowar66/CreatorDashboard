const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const FeedInteraction = require("../models/FeedInteraction");

const logFeedInteraction = async ({ userId, title, link, action, source }) => {
  return await FeedInteraction.create({
    userId,
    title,
    link,
    action,
    source,
  });
};

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
    await logFeedInteraction({
      userId: user._id,
      title,
      link,
      action: "saved",
      source,
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
    await logFeedInteraction({
      userId: user._id,
      title,
      link,
      action: "reported",
      source,
    });
    res.status(201).json({ message: "Post reported successfully", post });
  } catch (err) {
    res.status(400).json({ error: "Failed to report post" });
  }
});

router.post("/share", async (req, res) => {
  try {
    const { title, link, source } = req.body;
    const user = req.user;
    await logFeedInteraction({
      userId: user._id,
      title,
      link,
      action: "shared",
      source,
    });
    res
      .status(201)
      .json({ message: "Post shared activity logged successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to report post" });
  }
});

module.exports = router;
