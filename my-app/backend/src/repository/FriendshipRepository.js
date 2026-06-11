const { prisma } = require("../config/prismaConfig");

const createFriendship = async (senderId, receiverId) => {
  try {
    const friendship = await prisma.friendship.create({
      data: {
        follower: senderId,
        following: receiverId,
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

const retriveFollowersByUserId = async (userId) => {
  try {
    const payload = await prisma.friendship.findMany({
      where: {
        following: userId,
      },

      include: {
        followers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return payload;
  } catch (error) {
    console.log(`[Friendship Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const retriveFollowingsByUserId = async (userId) => {
  try {
    const payload = await prisma.friendship.findMany({
      where: {
        follower: userId,
      },
      include: {
        followings: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return payload;
  } catch (error) {
    console.log(`[Friendship Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const findChatFriendsByUserId = async (userId) => {
  try {
    const payload = await prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: true,
        user2: true,
      },
    });

    if (!payload) {
      return false;
    }

    return payload;
  } catch (error) {
    console.log(`[Friendship Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  createFriendship,
  retriveFollowersByUserId,
  retriveFollowingsByUserId,
  findChatFriendsByUserId,
};
