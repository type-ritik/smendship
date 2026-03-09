const { prisma } = require("../config/prismaConfig");

const findAllCommentByPostId = async (postId) => {
  try {
    const comment = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
    });

    if (!comment) {
      throw new Error("No comment found for the given post ID.");
    }

    return comment;
  } catch (error) {
    console.log(`[Comment Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const createComment = async (comment, postId, userId) => {
  try {
    const newComment = await prisma.comment.create({
      data: {
        content: comment,
        postId: postId,
        userId: userId,
      },
    });

    if (!newComment) {
      throw new Error("Failed to create a new comment.");
    }

    return newComment;
  } catch (error) {
    console.log(`[Comment Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const findAndUpdateCommentById = async (comment, commentId, userId) => {
  try {
    const updatedComment = await prisma.comment.update({
      where: { id: commentId, authorId: userId },
      data: {
        content: comment,
      },
    });
    if (!updatedComment) {
      throw new Error("Failed to update the comment.");
    }

    return updatedComment;
  } catch (error) {
    console.log(`[Comment Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const existedCommentById = async (commentId) => {
  try {
    const isCommentExisted = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!isCommentExisted) {
      throw new Error("Comment not found for the given comment ID.");
    }

    return !!isCommentExisted;
  } catch (error) {
    console.log(`[Comment Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const deleteCommentByIdAndUserId = async (commentId, userId) => {
  try {
    const commentDeleted = await prisma.comment.delete({
      where: {
        id: commentId,
        authorId: userId,
      },
    });

    if (!commentDeleted) {
      throw new Error("Failed to delete the comment.");
    }
    return !!commentDeleted;
  } catch (error) {
    console.log(`[Comment Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  findAllCommentByPostId,
  createComment,
  findAndUpdateCommentById,
  existedCommentById,
  deleteCommentByIdAndUserId,
};
