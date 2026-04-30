const { prisma } = require("../config/prismaConfig");

const createNotification = async (MessageChannel, toUserId, fromUserId) => {
  try {
    const payload = await prisma.notification.create({
      data: {
        toUserId,
        fromUserId,
        message: MessageChannel,
      },
    });
    if (!payload) {
      throw new Error("Failed to create notification.");
    }
    return payload;
  } catch (error) {
    console.log(`[Notification Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const getNotificationByUserId = async (userId) => {
  try {
    const payload = await prisma.notification.findMany({
      where: {
        toUserId: userId,
      },
      orderBy: {
        notifiedAt: "desc",
      },
    });

    if (!payload) {
      return false;
    }
    return payload;
  } catch (error) {
    console.log(`[Notification Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const updateNotificationAsReadByIdAndUserId = async (
  notificationId,
  userId,
) => {
  try {
    const payload = await prisma.notification.update({
      where: {
        id: notificationId,
        toUserId: userId,
      },
      data: {
        isRead: true,
      },
    });

    if (!payload) {
      return false;
    }

    return payload;
  } catch (error) {
    console.log(`[Notification Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  createNotification,
  getNotificationByUserId,
  updateNotificationAsReadByIdAndUserId,
};
