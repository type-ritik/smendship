const { prisma } = require("../config/prismaConfig");

const createFriendRequest = async (senderId, receiverId) => {
  try {
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        type: "FRIEND_REQUEST_SENT",
      },
    });

    if (!friendRequest) {
      throw new Error("Failed to create friend request.");
    }

    return friendRequest;
  } catch (error) {
    console.log(`[Friend Request Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const existedFriendRequest = async (senderId, receiverId) => {
  try {
    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
        type: "FRIEND_REQUEST_SENT",
      },
    });

    return !!friendRequest;
  } catch (error) {
    console.log(`[Friend Request Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const updateFriendRequestTypeToAccepted = async (friendRequestId) => {
  try {
    const updatedRequest = await prisma.friendRequest.update({
      where: { id: friendRequestId },
      data: { type: "FRIEND_REQUEST_ACCEPTED" },
    });

    if (!updatedRequest) {
      throw new Error("Failed to accept friend request status.");
    }

    return updatedRequest;
  } catch (error) {
    console.log(`[Friend Request Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const existedFriendRequestById = async (id) => {
  try {
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id },
    });

    return !!friendRequest;
  } catch (error) {
    console.log(`[Friend Request Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  createFriendRequest,
  existedFriendRequest,
  updateFriendRequestTypeToAccepted,
  existedFriendRequestById,
};
