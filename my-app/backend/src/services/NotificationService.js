const {
  getNotificationByUserId,
  updateNotificationAsReadByIdAndUserId,
} = require("../repository/NotificationRepository");

const retriveNotification = async (userId) => {
  try {
    const payload = await getNotificationByUserId(userId);

    if (!payload) {
      throw new Error("No notifications found for the user.");
    }

    console.log("Notification payload: ", payload);
    return payload;
  } catch (error) {
    console.log(`[Notification Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const updateNotification = async (notificationId, userId) => {
  try {
    const payload = await updateNotificationAsReadByIdAndUserId(notificationId, userId);

    if (!payload) {
      throw new Error("Failed to update notification as read.");
    }

    return payload;
  } catch (error) {
    console.log(`[Notification Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  retriveNotification,
  updateNotification,
};
