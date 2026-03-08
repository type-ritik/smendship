// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const {
//   FRIEND_REQUEST_ACCEPTED,
//   FRIEND_REQUEST_SENT,
// } = require("../config/pubsub");
// const pubsub = require("../subscription/pubsub");
const { getUserById, existsUserById } = require("../repository/UserRepository");
const {
  getAllPostByUserId,
  getPostByPostId,
  existedPostByTitleAndUserIdAndIsNotRevoked,
  createPost,
  updatePostById,
  existedPostByIdAndUserId,
  revokedPostByPostIdAndUserId,
} = require("../repository/PostRepository");
const {
  likeOrUnlikePostByUserId,
} = require("../repository/PostLikeRepository");

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

async function retrivePostByPostId(postId, userId) {
  try {
    const isUserExisted = await existsUserById(userId);

    if (!isUserExisted) {
      throw new Error("User not found");
    }

    const user = await getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.is_activated) {
      throw new Error("User is not activated");
    }

    if (user.status === "SUSPENDED") {
      throw new Error("User is suspended");
    }

    const post = await getPostByPostId(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.is_revoked) {
      throw new Error("Post is revoked");
    }

    delete post.is_revoked;

    return post;
  } catch (error) {
    console.log(`[Post Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function createNewPost(title, content, category, userId) {
  try {
    const isUserExisted = await existsUserById(userId);

    if (!isUserExisted) {
      throw new Error("User not found");
    }

    const user = await getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.is_activated) {
      throw new Error("User is not activated");
    }

    if (user.status === "SUSPENDED") {
      throw new Error("User is suspended");
    }

    const isPostExisted = await existedPostByTitleAndUserIdAndIsNotRevoked(
      title,
      userId,
    );

    if (isPostExisted) {
      throw new Error("Post with the same title already exists");
    }

    const post = await createPost(title, content, category, userId);

    if (!post) {
      throw new Error("Failed to create post");
    }

    delete post.is_revoked;

    return post;
  } catch (error) {
    console.log(`[Post Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function editPost(id, input, userId) {
  try {
    const isUserExisted = await existsUserById(userId);

    if (!isUserExisted) {
      throw new Error("User not found");
    }

    const isPostExisted = await existedPostByIdAndUserId(id, userId);

    if (!isPostExisted) {
      throw new Error("Post not found");
    }

    const data = {};

    if (input.title) {
      data.title = input.title;
    }

    if (input.content) {
      data.content = input.content;
    }

    if (input.category) {
      data.category = input.category;
    }

    const updatedPost = await updatePostById(id, userId, data);

    if (!updatedPost) {
      throw new Error("Failed to update post");
    }

    delete updatedPost.is_revoked;

    return {
      post: updatedPost,
    };
  } catch (error) {
    console.log(`[Post Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function removePost(id, userId) {
  try {
    const isUserExisted = await existsUserById(userId);

    if (!isUserExisted) {
      throw new Error("User not found");
    }

    const isPostExisted = await existedPostByIdAndUserId(id, userId);

    if (!isPostExisted) {
      throw new Error("Post not found");
    }

    const isPostRevoked = revokedPostByPostIdAndUserId(id, userId);

    if (!isPostRevoked) {
      throw new Error("Failed to remove post");
    }

    return {
      message: "Post removed successfully",
    };
  } catch (error) {
    console.log(`[Post Service Error]: `, error.message);
    throw new Error(error.message);
  }
}

async function togglePostLike(userId, postId) {
  try {
    const isPostExisted = await getPostByPostId(postId);

    if (!isPostExisted) {
      throw new Error("Post not found");
    }
    if (isPostExisted.is_revoked) {
      throw new Error("Post is revoked");
    }

    const toggleLike = await likeOrUnlikePostByUserId(userId, isPostExisted.id);

    if (!toggleLike) {
      throw new Error("Failed to toggle like");
    }

    return toggleLike;
  } catch (error) {
    console.log(`[Post Service Error]: `, error.message);
    throw new Error(error.message);
  }
}

module.exports = {
  retriveAllPostByUserId,
  retrivePostByPostId,
  createNewPost,
  editPost,
  removePost,
  togglePostLike,
};
