const { prisma } = require("../config/prismaConfig");

const createMessage = async (chatRoomId, senderId, content) => {
  try {
    const message = await prisma.message.create({
      data: {
        content,
        chatRoomId,
        senderId,
      },
      include: {
        sender: true,
        chatRoom: true,
      },
    });

    if (!message) {
      return null;
    } else {
      return message;
    }
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  createMessage,
};
