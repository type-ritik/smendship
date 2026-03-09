const {
  likeOrUnlikeCommentByCommentIdAndUserIdAndPostId,
} = require("../repository/CommentLikeRepository");
const {
  findAllCommentByPostId,
  createComment,
  existedCommentById,
  deleteCommentByIdAndUserId,
} = require("../repository/CommentRepository");
const { getPostByPostId } = require("../repository/PostRepository");

const fetchAllCommentsOnPost = async (postId) => {
  try {
    const isPostExist = await getPostByPostId(postId);

    if (!isPostExist) {
      throw new Error("Post not found for the given post ID.");
    }

    const comment = findAllCommentByPostId(isPostExist.id);

    if (!comment) {
      throw new Error("No comment found for the given post ID.");
    }

    return comment;
  } catch (error) {
    console.log(`[Comment Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const createNewComment = async (comment, postId, userId) => {
  try {
    const isPostExist = await getPostByPostId(postId);

    if (!isPostExist) {
      throw new Error("Post not found for the given post ID.");
    }

    const comment = await createComment(comment, postId, userId);

    if (!comment) {
      throw new Error("Failed to create a new comment.");
    }

    return comment;
  } catch (error) {
    console.log(`[Comment Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const editComment = async (comment, commentId, userId) => {
  try {
    const isCommentExisted = await existedCommentById(commentId);

    if (!isCommentExisted) {
      throw new Error("Comment not found for the given comment ID.");
    }

    const updatedComment = await findAndUpdateCommentById(
      comment,
      commentId,
      userId,
    );

    if (!updatedComment) {
      throw new Error("Failed to update the comment.");
    }
    return updatedComment;
  } catch (error) {
    console.log(`[Comment Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const revokedComment = async (commentId, userId) => {
  try {
    const isCommentExisted = await existedCommentById(commentId);

    if (!isCommentExisted) {
      throw new Error("Comment not found for the given comment ID.");
    }

    const commentDeleted = await deleteCommentByIdAndUserId(commentId, userId);

    if (!commentDeleted) {
      throw new Error("Failed to delete the comment.");
    }

    return !!commentDeleted;
  } catch (error) {
    console.log(`[Comment Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const toggleCommentLike = async (commentId, userId, postId) => {
  try {
    const isPostExisted = await getPostByPostId(postId);

    if (!isPostExisted) {
      throw new Error("Post not found for the given post ID.");
    }

    const isCommentExisted = await existedCommentById(commentId);

    if (!isCommentExisted) {
      throw new Error("Comment not found for the given comment ID.");
    }

    const toggle = await likeOrUnlikeCommentByCommentIdAndUserIdAndPostId(
      commentId,
      userId,
      postId,
    );

    if (!toggle) {
      throw new Error("Failed to toggle like on the comment.");
    }
    return !!toggle;
  } catch (error) {
    console.log(`[Comment Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};
module.exports = {
  fetchAllCommentsOnPost,
  createNewComment,
  editComment,
  revokedComment,
  toggleCommentLike,
};
