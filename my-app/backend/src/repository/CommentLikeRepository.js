const { prisma } = require("../config/prismaConfig");

async function likeOrUnlikeCommentByCommentIdAndUserIdAndPostId(
  commentId,
  userId,
  postId,
) {
  try {
    const isLikeExist = await prisma.commentLike.findFirst({
      where: {
        userId,
        commentId,
        postId,
      },
    });

    if (!isLikeExist) {
      const likePost = await prisma.commentLike.create({
        data: {
          userId,
          postId,
          commentId,
        },
      });

      if (!likePost) {
        throw new Error("Failed to like Comment");
      }
      return !!likePost;
    } else {
      const toggleLike = await prisma.commentLike.delete({
        where: {
          id: isLikeExist.id,
        },
      });

      if (!toggleLike) {
        throw new Error("Failed to unlike Comment");
      }
      return !!toggleLike;
    }
  } catch (error) {
    console.log(`[Comment Like Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

module.exports = {
  likeOrUnlikeCommentByCommentIdAndUserIdAndPostId,
};
