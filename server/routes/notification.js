const express = require("express");
const router = express.Router();
const {
  getNotifications,
} = require("../controllers/notification");

router.get("/", async (req, res) => {
  const user = req.user;
  try {
    const redisResponse = await getNotifications(user._id);
    res.status(200).json({
      message: "Notifications fetch successfully",
      notifications: redisResponse.notifications || [],
    });
  } catch (err) {
    res.status(400).json({ error: "Failed to report post" });
  }
});

module.exports = router;
