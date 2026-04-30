const { pubsub } = require("../subscription/pubsub");

const friendRequestReceiveSubs = (userId) => {
  try {
    const payload = pubsub.asyncIterableIterator(`FRIEND_RECEIVE_${userId}`);

    if (!payload) {
      throw new Error("Failed to subscribe to friend request sent.");
    }

    console.log("Subs: ", payload);
    return payload;
  } catch (error) {
    console.log(`[Subscription Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const activeChatSubs = (userId) => {
  try {
    const payload = pubsub.asyncIterator(`CHAT_${userId}`);

    if (!payload) {
      throw new Error("Failed to subscribe to active chat.");
    }

    console.log("Subs: ", payload);
    return payload;
  } catch (error) {
    console.log(`[Subscription Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const notifyUserSubs = (userId) => {
  try {
    const payload = pubsub.asyncIterator(`NOTIFY_${userId}`);

    if (!payload) {
      throw new Error("Failed to subscribe to notification.");
    }

    console.log("Subs: ", payload);
    return payload;
  } catch (error) {
    console.log(`[Subscription Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  friendRequestReceiveSubs,
  activeChatSubs,
  notifyUserSubs,
};
