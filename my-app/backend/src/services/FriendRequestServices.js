const {
  existedFriendRequest,
  createFriendRequest,
  existedFriendRequestById,
  updateFriendRequestTypeToAccepted,
} = require("../repository/FriendRequestRepository");
const { createFriendship } = require("../repository/FriendshipRepository");
const { createNotification } = require("../repository/NotificationRepository");
const { existsUserById } = require("../repository/UserRepository");
const { pubsub } = require("../subscription/pubsub");

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

    const notification = await createNotification(
      "CHAT_ROOM_ACTIVATED",
      receiverId,
      senderId,
    );

    console.log(`Notification sent to ${receiverId}`);

    await pubsub.publish(`notify:${receiverId}`, {
      iNotified: notification,
    });

    await pubsub.publish(`FRIEND_RECEIVE_${receiverId}`, {
      friendRequestSent: friendRequest,
    });

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

    await pubsub.publish(FRIEND_REQUEST_ACCEPTED, {
      friendRequestAccepted: acceptRequest,
    });

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
