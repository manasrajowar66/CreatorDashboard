const express = require("express");
const router = express.Router();
const axios = require("axios");
const { redisClient } = require("../config/redisClient");

router.get("/", async (req, res) => {
  const cacheKey = "feedData";

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Serving from cache");
      return res.json({
        message: "Feed fetched successfully",
        data: JSON.parse(cached),
      });
    }

    const subreddits = ["javascript", "webdev"];
    const allPosts = [];

    for (const sub of subreddits) {
      const response = await axios.get(`https://www.reddit.com/r/${sub}.json`);
      const posts = response.data.data.children.map((item) => ({
        title: item.data.title,
        link: "https://reddit.com" + item.data.permalink,
        source: "Reddit",
        subreddit: sub,
      }));
      allPosts.push(...posts);
    }

    const mockTwitterPosts = [
      {
        title: "New React update is out!",
        link: "https://twitter.com/example",
        source: "Twitter",
      },
      {
        title: "Tips on Tailwind CSS",
        link: "https://twitter.com/example2",
        source: "Twitter",
      },
    ];

    const mockLinkedInPosts = [
      {
        title: "🔗 LinkedIn: 5 Tips to Improve Your Developer Profile",
        link: "https://linkedin.com/in/example",
        source: "LinkedIn",
      },
      {
        title: "💼 LinkedIn: How to network better as a Software Engineer",
        link: "https://linkedin.com/in/example2",
        source: "LinkedIn",
      },
    ];

    const finalFeed = [...mockTwitterPosts, ...allPosts, ...mockLinkedInPosts];

    await redisClient.setEx(cacheKey, 300, JSON.stringify(finalFeed));
    console.log("Serving from API and caching the result");

    res.json({ message: "Feed fetched successfully", data: finalFeed });
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

module.exports = router;
