const {
  findChatRoomByUserIdAndTargetUserId,
  createChatRoom,
} = require("../repository/ChatRoomRepository");
const { createNotification } = require("../repository/NotificationRepository");
const { pubsub } = require("../subscription/pubsub");

const chatRoomActivate = async (userId, targetUserId) => {
  try {
    let room = await findChatRoomByUserIdAndTargetUserId(userId, targetUserId);

    if (!room) {
      room = await createChatRoom(userId, targetUserId);
    }

    const notification = await createNotification(
      "CHAT_ROOM_ACTIVATED",
      targetUserId,
      userId,
    );

    await pubsub.publish(`notify:${targetUserId}`, {
      iNotified: notification,
    });

    return room;
  } catch (error) {
    console.log(`[Chat Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  chatRoomActivate,
};
