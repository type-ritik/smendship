// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const {
//   FRIEND_REQUEST_ACCEPTED,
//   FRIEND_REQUEST_SENT,
// } = require("../config/pubsub");
// const pubsub = require("../subscription/pubsub");
const { getUserById } = require("../repository/UserRepository");
const { getAllPostByUserId } = require("../repository/PostRepository");

async function retriveAllPostByUserId(userId) {
  try {
    const user = await getUserById(userId);

    if (user.status === "SUSPENDED") {
      throw new Error("User is suspended");
    }

    const post = await getAllPostByUserId(user.id);

    // Filter to retrive only public post
    post.filter((p) => p.is_revoked !== true);

    // Removed is_revoked property from payload
    post.forEach((p) => {
      if (p.is_revoked) {
        delete p.is_revoked;
      }
    });

    console.log("Filtered Post: ", post);

    return post;
  } catch (error) {
    console.log(`[Post Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

module.exports = { retriveAllPostByUserId };
