const { NotificationType } = require("../utils/utils");
const User = require("../models/User");

const getCreditsForActivity = (activityType) => {
  switch (activityType) {
    case NotificationType.REGISTER:
      return 50;
    case NotificationType.POST_SAVE:
      return 10;
    case NotificationType.POST_SHARE:
      return 20;
    case NotificationType.LOGIN:
      return 5;
    case NotificationType.PROFILE_COMPLETE:
      return 30;
    case NotificationType.FEED_INTERACTION:
      return 15;
    case NotificationType.PROFILE_UPDATED:
      return 10;
    case NotificationType.CREDITS_ADDED:
      return 0; // No extra points, already credit-related
    case NotificationType.CREDITS_REDEEMED:
      return 0; // No points added, user is redeeming
    case NotificationType.POST_REPORT:
      return 5; // Small points for reporting
    case NotificationType.PASSWORD_CHANGED:
      return 5;
    default:
      return 0;
  }
};

const updateUserCredits = async (activity) => {
  const pointsToAdd = getCreditsForActivity(activity.type);
  const user = await User.findOne({ _id: activity.userId });
  if (user) {
    user.credits += pointsToAdd;
    await user.save();
  }
  return user.credits;
};

module.exports = {
  updateUserCredits,
  getCreditsForActivity
};
