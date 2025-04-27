const express = require("express");
const authRoutes = require("./auth");
const feedRoutes = require("./feed");
const postRoutes = require("./post");
const dashboardRoutes = require("./dashboard");
const notificationRoutes = require("./notification");
const { restrictToLoggedInUserOnly } = require("../middlewares/auth");

const indexRoutes = express.Router();

indexRoutes.use("/auth", authRoutes);
indexRoutes.use("/feed", restrictToLoggedInUserOnly, feedRoutes);
indexRoutes.use("/post", restrictToLoggedInUserOnly, postRoutes);
indexRoutes.use("/dashboard", restrictToLoggedInUserOnly, dashboardRoutes);
indexRoutes.use("/notification", restrictToLoggedInUserOnly, notificationRoutes);

module.exports = indexRoutes