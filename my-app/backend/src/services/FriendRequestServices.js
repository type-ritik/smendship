const {
  existedFriendRequest,
  createFriendRequest,
  existedFriendRequestById,
  updateFriendRequestTypeToAccepted,
} = require("../repository/FriendRequestRepository");
const { createFriendship } = require("../repository/FriendshipRepository");
const { existsUserById } = require("../repository/UserRepository");

const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const isReceiverExisted = await existsUserById(receiverId);

    if (!isReceiverExisted) {
      throw new Error("Receiver user does not exist.");
    }

    const existedRequest = await existedFriendRequest(senderId, receiverId);

    if (existedRequest) {
      throw new Error("A friend request already exists between these users.");
    }
    // Call the repository function to create a friend request
    const friendRequest = await createFriendRequest(senderId, receiverId);

    if (!friendRequest) {
      throw new Error("Failed to send friend request.");
    }

    return !!friendRequest;
  } catch (error) {
    console.log(`[Friend Request Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const acceptFriendRequest = async (friendRequestId) => {
  try {
    const isFriendRequestExisted =
      await existedFriendRequestById(friendRequestId);

    if (!isFriendRequestExisted) {
      throw new Error("Friend request does not exist.");
    }

    const acceptRequest =
      await updateFriendRequestTypeToAccepted(friendRequestId);

    if (!acceptRequest) {
      throw new Error("Failed to accept friend request.");
    }

    const friendshipCreated = await createFriendship(
      acceptRequest.senderId,
      acceptRequest.receiverId,
    );

    if (!friendshipCreated) {
      throw new Error(
        "Failed to create friendship after accepting friend request.",
      );
    }
    return !!friendshipCreated;
  } catch (error) {
    console.log(`[Friend Request Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
};
