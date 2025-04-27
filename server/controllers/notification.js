const { redisClient } = require("../config/redisClient");
const UserActivity = require("../models/UserActivity");
const { getIo } = require("../socket");
const { NotificationType } = require("../utils/utils");
const { updateUserCredits } = require("./user");

const notificationMessages = {
  [NotificationType.REGISTER]: "Welcome! Thanks for registering with us!",
  [NotificationType.POST_SAVE]: "You saved a post!",
  [NotificationType.POST_REPORT]: "You reported a post!",
  [NotificationType.POST_SHARE]: "You shared a post!",
  [NotificationType.LOGIN]: "Welcome back!",
  [NotificationType.PROFILE_COMPLETE]:
    "You earned credits for completing your profile!",
  [NotificationType.FEED_INTERACTION]:
    "You earned credits for interacting with the feed!",
  [NotificationType.PASSWORD_CHANGED]:
    "Your password was successfully changed!",
  [NotificationType.PROFILE_UPDATED]: "Your profile was updated successfully!",
  [NotificationType.CREDITS_ADDED]:
    "You earned credits for your recent action!",
};

/**
 * Save a notification for a user
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.type - Type of action (save, report, share, login, profile_complete, feed_interaction)
 * @param {string} params.message
 * @param {string} [params.postId] - post ID (for post-related actions)
 * @param {Object} [params.extraInfo] - additional data
 */
const saveNotification = async ({
  userId,
  type,
  message = "",
  postId = null,
  extraInfo = null,
}) => {
  try {
    if (!userId || !type) {
      throw new Error("Missing required fields: userId or type");
    }

    if (!message) {
      message = notificationMessages[type] || "You have a new notification!";
    }

    const notification = {
      type,
      message,
      timestamp: new Date().toISOString(),
      postId,
      extraInfo,
    };

    const redisKey = `notifications:${userId}`;

    await redisClient.lPush(redisKey, JSON.stringify(notification));
    await redisClient.lTrim(redisKey, 0, 19);

    const activity = new UserActivity({
      userId,
      type,
      message,
      timestamp: new Date(),
      postId,
      extraInfo,
    });

    await activity.save();

    const updatedCredit = await updateUserCredits(activity);

    const io = getIo();
    if (io) {
      const socketId = await redisClient.get(`user:${userId}`);
      io.to(socketId).emit("newNotification", notification);
      io.to(socketId).emit("updateCredit", updatedCredit);
    }

    return { success: true, message: "Notification saved successfully" };
  } catch (error) {
    console.error("Error saving notification:", error);
    return { success: false, message: "Error saving notification", error };
  }
};

/**
 * Get last 20 notifications for a user
 *
 * @param {string} userId
 */
const getNotifications = async (userId) => {
  try {
    if (!userId) {
      throw new Error("UserId is required");
    }

    const redisKey = `notifications:${userId}`;
    const notifications = await redisClient.lRange(redisKey, 0, 19);

    const parsedNotifications = notifications.map((item) => JSON.parse(item));

    return { success: true, notifications: parsedNotifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, message: "Error fetching notifications", error };
  }
};

module.exports = {
  saveNotification,
  getNotifications,
  NotificationType,
};
