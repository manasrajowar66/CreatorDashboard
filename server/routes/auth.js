const express = require("express");
const User = require("../models/User");
const { createHmac } = require("crypto");
const lodash = require("lodash");
const { generateToken } = require("../controllers/auth");
const { restrictToLoggedInUserOnly } = require("../middlewares/auth");
const { saveNotification } = require("../controllers/notification");
const { NotificationType } = require("../utils/utils");
const { getCreditsForActivity } = require("../controllers/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        message: "This email already exist",
      });
    }

    const newUser = await User.create({
      full_name,
      email,
      password,
    });

    saveNotification({
      userId: newUser._id,
      type: NotificationType.REGISTER,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user_id: newUser._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "This email or password is invalid",
      });
    }

    const hashPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashPassword !== user.password) {
      return res.status(400).json({
        message: "This email or password is invalid",
      });
    }

    // add credits for daily login
    const today = new Date();
    const lastLogin = user.lastLogin || new Date(0);
    const isNewDay = today.toDateString() !== lastLogin.toDateString();

    if (isNewDay) {
      user.credits += getCreditsForActivity(NotificationType.LOGIN); // give 5 points for daily login
      user.lastLogin = today;
      await user.save();
      saveNotification({
        userId: user._id,
        type: NotificationType.LOGIN,
      });
      saveNotification({
        userId: user._id,
        type: NotificationType.CREDITS_ADDED,
        message: "You earned credits for logging in today! Keep it up!",
      });
    }

    const result = lodash.omit(user.toObject(), ["password", "salt"]);

    const token = generateToken(result);

    return res.status(200).json({
      message: "Logged in successfully",
      user: result,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/auth-check", restrictToLoggedInUserOnly, async (req, res) => {
  let user = req.user;
  user = await User.findOne({ _id: user._id });
  const result = lodash.omit(user.toObject(), ["password", "salt"]);

  const token = generateToken(result);

  res.json({ message: "Authenticated", user: result, token });
});

module.exports = router;
