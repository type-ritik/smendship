const {
  createFriendRequest,
  updateFriendRequestType,
  receivedFriendRequestList,
  sentFriendRequestList,
} = require("../repository/FriendRequestRepository");
const { createFriendship } = require("../repository/FriendshipRepository");
const { createNotification } = require("../repository/NotificationRepository");
const { pubsub } = require("../subscription/pubsub");

const sendFriendRequest = async (senderId, receiverId) => {
  try {
    // Call the repository function to create a friend request
    const friendRequest = await createFriendRequest(senderId, receiverId);

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

const retriveReceivedFriendRequestList = async (userId) => {
  try {
    const requests = await receivedFriendRequestList(userId);

    return requests.map((request) => ({
      id: request.id,
      user: request.sender,
      createdAt: request.requestedAt,
    }));
  } catch (error) {
    console.log(`[Friend Request Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const retriveSentFriendRequestList = async (userId) => {
  try {
    const requests = await sentFriendRequestList(userId);

    return requests.map((request) => ({
      id: request.id,
      user: request.receiver,
      createdAt: request.requestedAt,
    }));
  } catch (error) {
    console.log(`[Friend Request Sent List Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const setFriendRequestResponse = async (
  friendRequestId,
  responseCode,
  userId,
) => {
  try {
    const requestResponse = await updateFriendRequestType(
      friendRequestId,
      responseCode,
      userId,
    );

    const response = requestResponse.isAccepted;
    const receiverId =
      requestResponse.senderId === userId
        ? requestResponse.receiverId
        : requestResponse.senderId;

    if (response === true || response === false) {
      const notify = await createNotification(
        requestResponse.type,
        receiverId,
        userId,
      );

      await pubsub.publish(`NOTIFY_${receiverId}`, {
        notification: notify,
      });
    }

    return response;
  } catch (error) {
    console.log(`[Friend Request Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  sendFriendRequest,
  setFriendRequestResponse,
  retriveReceivedFriendRequestList,
  retriveSentFriendRequestList,
};
