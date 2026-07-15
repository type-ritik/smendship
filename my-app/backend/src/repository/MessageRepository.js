const { prisma } = require("../config/prismaConfig");

const createMessage = async (content, chatRoomId, userId) => {
  try {
    const message = await prisma.message.create({
      data: {
        content,
        chatRoomId,
        senderId: userId,
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
          },
        },
        chatRoom: {
          select: {
            id: true,
            participants: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return message;
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  createMessage,
};
