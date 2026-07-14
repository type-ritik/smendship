const { prisma } = require("../config/prismaConfig");

const retriveChatList = async (chatRoomId) => {
  try {
    const chats = await prisma.message.findMany({
      where: {
        chatRoomId,
      },
      select: {
        id: true,
        content: true,
        seenAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            profile_image: true,
            status: true,
          },
        },
        chatRoom: {
          select: {
            id: true,
          },
        },
      },
    });

    return chats;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findChatRoomByTargetUserId = async (targetUserId) => {
  try {
    const chatRoom = await prisma.participant.findFirst({
      where: {
        userId: targetUserId,
      },
      select: {
        chatRoomId: true,
      },
    });

    if (!chatRoom) {
      return false;
    } else {
      return chatRoom.chatRoomId;
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

    if (payload.length < 1) {
      return false;
    }

    return payload;
  } catch (error) {
    console.log(`[Chat Room Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const retriveParticipantData = async (chatRoomId, userId) => {
  try {
    const payload = await prisma.participant.findFirst({
      where: {
        chatRoomId,
        NOT: {
          userId,
        },
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            profile_image: true,
            status: true,
          },
        },
      },
    });

    return payload;
  } catch (error) {
    console.log(`[ChatRoom repository error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const retrieveRoomMessage = async (chatRoomId, lastMessageId) => {
  try {
    const payload = !lastMessageId
      ? await prisma.message.findMany({
          where: {
            chatRoomId,
          },
          take: 10,
          orderBy: { id: "asc" },
          select: {
            id: true,
            sender: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
            content: true,
            seenAt: true,
          },
        })
      : await prisma.message.findMany({
          where: {
            chatRoomId,
          },
          take: 10,
          skip: 1,
          cursor: {
            id: lastMessageId,
          },
          orderBy: { id: "asc" },
          select: {
            id: true,
            sender: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
            content: true,
            seenAt: true,
          },
        });

    return payload;
  } catch (error) {
    console.log("Chatroom repo error: ", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  findChatRoomByTargetUserId,
  createChatRoom,
  getAllParticipantsByUserId,
  createParticipants,
  retriveChatList,
  retriveParticipantData,
  retrieveRoomMessage,
};
