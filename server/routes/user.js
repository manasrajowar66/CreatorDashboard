const express = require("express");
const User = require("../models/User");
const { createHmac } = require("crypto");
const lodash = require("lodash");
const { generateToken } = require("../controllers/auth");
const {
  restrictToLoggedInUserOnly,
  restrictToRoles,
} = require("../middlewares/auth");
const { saveNotification } = require("../controllers/notification");
const { NotificationType } = require("../utils/utils");
const { getCreditsForActivity } = require("../controllers/user");

const router = express.Router();

router.put("/profile", restrictToLoggedInUserOnly, async (req, res) => {
  const { full_name, phone, address } = req.body;

  if (!full_name || !phone) {
    return res.status(400).json({
      message: "Full name and phone are required",
    });
  }

  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.full_name = full_name;
    user.phone = phone;
    user.address = address || "";

    if (
      user.full_name &&
      user.phone &&
      user.email &&
      user.address &&
      !user.profileCompleted
    ) {
      user.profileCompleted = true;
      user.credits += getCreditsForActivity(NotificationType.PROFILE_COMPLETE); // give 10 points for profile completed
      saveNotification({
        userId: user._id,
        type: NotificationType.PROFILE_COMPLETE,
      });
    }

    await user.save();

    const updatedUser = lodash.omit(user.toObject(), ["password", "salt"]);
    const token = generateToken(updatedUser);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.patch(
  "/update-credits/:userId",
  restrictToRoles("admin"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { updatedCredits } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.credits = updatedCredits;
      await user.save();

      saveNotification({
        userId,
        type: NotificationType.PROFILE_UPDATED,
        message: "Your credits have been updated by admin!",
      });

      return res.status(200).json({
        message: "Credits updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;
