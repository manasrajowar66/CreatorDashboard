const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");
const postRoutes = require("./routes/post");
const dashboardRoutes = require("./routes/dashboard");
const { redisClient } = require("./config/redisClient");
const { restrictToLoggedInUserOnly } = require("./middlewares/auth");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/health-check", (req, res) => {
  res.status(200).json({
    message: "App is running up!",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/feed", restrictToLoggedInUserOnly, feedRoutes);
app.use("/api/post", restrictToLoggedInUserOnly, postRoutes);
app.use("/api/dashboard", restrictToLoggedInUserOnly, dashboardRoutes);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await redisClient.connect();
    console.log("✅ Redis Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup Error:", err);
  }
}

startServer();
