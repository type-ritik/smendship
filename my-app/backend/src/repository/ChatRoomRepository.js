const { prisma } = require("../config/prismaConfig");

const findChatRoomByTargetUserId = async (targetUserId) => {
  try {
    const chatRoom = await prisma.participant.findFirst({
      where: {
        userId: targetUserId,
      },
      select: {
        id: true,
      },
    });

    if (!chatRoom) {
      return false;
    } else {
      return chatRoom.id;
    }
  } catch (error) {
    console.log(`[Chat Room Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const createParticipants = async (userId, role, chatroomId) => {
  try {
    const member = await prisma.participant.create({
      data: {
        userId,
        role,
        chatRoomId: chatroomId,
      },
    });

    return member;
  } catch (error) {
    console.log(`[Chat room repository error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const createChatRoom = async () => {
  try {
    const room = await prisma.chatRoom.create({
      data: {},
      select: {
        id: true,
      },
    });

    return room.id;
  } catch (error) {
    console.log(`[Chat Room Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const getAllParticipantsByUserId = async (userId) => {
  try {
    const payload = await prisma.participant.findMany({
      where: {
        userId,
      },

      select: {
        chatRoomId: true,
        chatRoom: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profile_image: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(payload);

    if (payload.length < 1) {
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
  findChatRoomByTargetUserId,
  createChatRoom,
  getAllParticipantsByUserId,
  createParticipants,
  getAllChatroomChatListByUserIdAndChatroomId,
};
