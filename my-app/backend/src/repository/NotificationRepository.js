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

module.exports = {
  createNotification,
};
