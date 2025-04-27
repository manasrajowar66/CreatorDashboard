const socketIo = require("socket.io");
const { redisClient } = require("./config/redisClient");

let io;

// Store users and their socket IDs in Redis
const storeSocketId = (userId, socketId) => {
  redisClient.set(`user:${userId}`, socketId);
};

const deleteSocketId = (userId) => {
  redisClient.del(`user:${userId}`);
};

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("register-user", (userId) => {
      storeSocketId(userId, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      // deleteSocketId(userId);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIo };
