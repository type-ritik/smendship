const { prisma } = require("../config/prismaConfig");

const createFriendship = async (senderId, receiverId) => {
  try {
    const friendship = await prisma.friendship.create({
      data: {
        user1Id: senderId,
        user2Id: receiverId,
      },
    });

    if (!friendship) {
      throw new Error("Failed to create friendship.");
    }
    return friendship;
  } catch (error) {
    console.log(`[Friendship Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = { createFriendship };
