const {
  findFriendsByUserId,
  retriveFollowersByUserId,
  retriveFollowingsByUserId,
} = require("../repository/FriendshipRepository");

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

const myFollowers = async (userId) => {
  try {
    const payload = await retriveFollowersByUserId(userId);

    return payload.map((friend) => ({
      id: friend.id,
      createdAt: friend.createdAt,
      user: friend.followers,
    }));
  } catch (error) {
    console.log(`[Followers Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const myFollowings = async (userId) => {
  try {
    const payload = await retriveFollowingsByUserId(userId);

    return payload.map((friend) => ({
      id: friend.id,
      createdAt: friend.createdAt,
      user: friend.followings,
    }));
  } catch (error) {
    console.log(`[Followings Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  findFriendChatList,
  myFollowers,
  myFollowings,
};
