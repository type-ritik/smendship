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

const getAllParticipantsByUserId = async (userId) => {
  try {
    const payload = await prisma.participant.findMany({
      where: { userId },
      include: {
        chatRoom: true,
        user: true,
      },
    });

    if (!payload) {
      return false;
    }

    return payload;
  } catch (error) {
    console.log(`[Chat Room Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const getAllChatroomChatListByUserIdAndChatroomId = async (
  chatRoomId,
  userId,
) => {
  try {
    const payload = await prisma.message.findMany({
      where: {
        chatRoomId,
      },
      include: {
        sender: true,
        chatRoom: true,
      },
    });

    if (!payload) {
      return false;
    }

    return payload;
  } catch (error) {
    console.log(`[Chat Room Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  findChatRoomByUserIdAndTargetUserId,
  createChatRoom,
  getAllParticipantsByUserId,
  getAllChatroomChatListByUserIdAndChatroomId,
};
