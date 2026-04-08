const { prisma } = require("../config/prismaConfig");

const findChatRoomByUserIdAndTargetUserId = async (userId, targetUserId) => {
  try {
    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        isGroup: false,
        OR: [
          {
            user1Id: userId,
            user2Id: targetUserId,
          },
          {
            user1Id: targetUserId,
            user2Id: userId,
          },
        ],
      },
    });

    if (!chatRoom) {
      return null;
    } else {
      return chatRoom;
    }
  } catch (error) {
    console.log(`[Chat Room Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const createChatRoom = async (userId, targetUserId) => {
  try {
    const room = await prisma.chatRoom.create({
      data: {
        user1Id: userId,
        user2Id: targetUserId,
        isGroup: false,
      },
    });

    if (!room) {
      throw new Error("Failed to create chat room.");
    } else {
      return room;
    }
  } catch (error) {
    console.log(`[Chat Room Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  findChatRoomByUserIdAndTargetUserId,
  createChatRoom,
};
