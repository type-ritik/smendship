const { findFriendsByUserId } = require("../repository/FriendshipRepository");

const findFriendChatList = async (userId) => {
  try {
    const payload = await findFriendsByUserId(userId);

    if (!payload) {
      throw new Error("Failed to retrieve friend chat list.");
    }

    return payload;
  } catch (error) {
    console.log(`[ExploreFriend Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  findFriendChatList,
};
