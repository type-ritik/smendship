const { prisma } = require("../config/prismaConfig");

async function getTotalLikeOfPostId(postId) {
  try {
    const totalLikesInPost = await prisma.postLike.count({
      where: { postId },
    });

    if (!totalLikesInPost) {
      throw new Error("No posts found for the given ID");
    }

    return totalLikesInPost;
  } catch (error) {
    console.log(`[Post Like Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function likeOrUnlikePostByUserId(userId, postId) {
  try {
    const isLikeExist = await prisma.postLike.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (!isLikeExist) {
      const likePost = await prisma.postLike.create({
        data: {
          userId,
          postId,
        },
      });

      if (!likePost) {
        throw new Error("Failed to like post");
      }
      return !!likePost;
    } else {
      const toggleLike = await prisma.postLike.update({
        where: {
          id: isLikeExist.id,
        },
        data: {
          isRevoked: !isLikeExist.isRevoked,
        },
      });

      if (!toggleLike) {
        throw new Error("Failed to unlike post");
      }
      return !!toggleLike;
    }
  } catch (error) {
    console.log(`[Post Like Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

module.exports = {
  getTotalLikeOfPostId,
  likeOrUnlikePostByUserId,
};
