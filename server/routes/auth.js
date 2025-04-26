const express = require("express");
const User = require("../models/User");
const { createHmac } = require("crypto");
const lodash = require("lodash");
const { generateToken } = require("../controllers/auth");
const { restrictToLoggedInUserOnly } = require("../middlewares/auth");

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

    const today = new Date();
    const lastLogin = user.lastLogin || new Date(0);
    const isNewDay = today.toDateString() !== lastLogin.toDateString();

    if (isNewDay) {
      user.credits += 5; // give 5 points for daily login
      user.lastLogin = today;
      await user.save();
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
  const user = req.user;
  res.json({ message: "Authenticated", user });
});

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
    if (user.full_name && user.phone && user.email && user.address && !user.profileCompleted) {
      user.profileCompleted = true;
      user.credits += 10; // give 10 points for profile completed
    }

    await user.save();

    const updatedUser = lodash.omit(user.toObject(), ["password", "salt"]);
    const token = generateToken(updatedUser);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
