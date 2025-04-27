const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const indexRoutes = require("./routes");
const { redisClient } = require("./config/redisClient");
const path = require("path");
require("dotenv").config();

const { initializeSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

// Initialize the WebSocket connection
initializeSocket(server);

app.use(cors());
app.use(express.json());

app.use("/api", indexRoutes);

// Serving frontend static files
app.use(express.static(path.resolve(__dirname, "build")));

// Wildcard route
app.get(/(.*)/, (req, res) => {
  return res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await redisClient.connect();
    console.log("✅ Redis Connected");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup Error:", err);
  }
}

startServer();
