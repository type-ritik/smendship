const { prisma } = require("../config/prismaConfig");

const createFriendRequest = async (senderId, receiverId) => {
  try {
    const friendRequest = await prisma.friendRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiverId,
        },
      },
      update: {
        acceptedAt: new Date(),
      },
      create: {
        senderId,
        receiverId,
        type: "FRIEND_REQUEST_SENT",
      },
    });

    const isExisting =
      friendRequest.requestedAt.getTime() !==
      friendRequest.acceptedAt.getTime();

    if (isExisting) {
      throw new Error("Friend request already exists");
    }

    return friendRequest;
  } catch (error) {
    console.log(`[Friend Request Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

// user can accept or reject the friend request and its based on the user response of isAccepted: True -> Accepted | False -> Rejected

const updateFriendRequestType = async (
  friendRequestId,
  responseCode,
  userId,
) => {
  try {
    const updatedRequest = await prisma.$transaction(async (tx) => {
      const { count } = await tx.friendRequest.updateMany({
        where: {
          id: friendRequestId,
          OR: [{ receiverId: userId }, { senderId: userId }],
        },
        data: {
          type:
            responseCode === "ACCEPT"
              ? "FRIEND_REQUEST_ACCEPTED"
              : responseCode === "REJECT"
                ? "FRIEND_REQUEST_REJECTED"
                : "FRIEND_REQUEST_REVOKED",
          isAccepted:
            responseCode === "ACCEPT"
              ? true
              : responseCode === "REJECT"
                ? false
                : null,
        },
      });

      if (count === 0) {
        throw new Error("Friend request not found or unauthorized");
      }

      return tx.friendRequest.findUnique({
        where: { id: friendRequestId },
      });
    });

    return updatedRequest;
  } catch (error) {
    console.log(`[Friend Request Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const receivedFriendRequestList = async (id) => {
  try {
    const lists = await prisma.friendRequest.findMany({
      where: {
        receiverId: id,
        type: "FRIEND_REQUEST_SENT",
      },

      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return lists;
  } catch (error) {
    console.log(`[Friend Request Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const sentFriendRequestList = async (id) => {
  try {
    const lists = await prisma.friendRequest.findMany({
      where: {
        senderId: id,
        type: "FRIEND_REQUEST_SENT",
      },

      include: {
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return lists;
  } catch (error) {
    console.log(`[Friend Request Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  createFriendRequest,
  updateFriendRequestType,
  receivedFriendRequestList,
  sentFriendRequestList,
};
