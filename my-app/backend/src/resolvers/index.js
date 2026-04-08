// File: backend/src/resolvers/index.js
const { prisma } = require("../config/prismaConfig");
const pubsub = require("../subscription/pubsub");
const {
  retriveAllPostByUserId,
  retrivePostByPostId,
  createNewPost,
} = require("../services/PostServices");
const {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidUUID,
} = require("../utils/UserUtils");
const { userLogin, createAccount } = require("../services/UserAuthServices");
const {
  deleteUserById,
  updateUserProfile,
} = require("../services/UserServices");
const {
  fetchAllCommentsOnPost,
  createNewComment,
  editComment,
  revokedComment,
  toggleCommentLike,
} = require("../services/CommentService");
const {
  sendFriendRequest,
  acceptFriendRequest,
} = require("../services/FriendRequestServices");
const { chatRoomActivate } = require("../services/ChatServices");
// import { subscribeToNotify } from "../utils/subscriber.js";

const resolvers = {
  Notification: {
    fromUserId: (parent, _) =>
      prisma.user.findUnique({ where: { id: parent.fromUserId } }),
    toUserId: (parent, _) =>
      prisma.user.findUnique({ where: { id: parent.toUserId } }),
    post: (parent, _) =>
      parent.postId
        ? prisma.post.findUnique({ where: { id: parent.postId } })
        : null,
  },
  Query: {
    // Query work like GET
    hello: () => "Hello World! 🌍",
    getNotification: async (_, __, context) => {
      const userId = context.user.id;
      if (!userId) throw new AuthenticationError("Unauthorized");

      return await prisma.notification.findMany({
        where: { toUserId: userId },
        orderBy: { notifiedAt: "desc" },
      });
    },
    getpost: async (_, { id }, context) => {
      const userId = context.user.id;

      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(id)) {
        throw new Error("Invalid Post ID");
      }

      try {
        const payload = await retrivePostByPostId(id, userId);

        if (!payload) {
          throw new Error("Error retriving post");
        }

        return payload;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    getAllPost: async (_, obj, context) => {
      const userId = context.user.id;
      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      try {
        const payload = await retriveAllPostByUserId(userId);

        if (!payload) {
          throw new Error("Error retriving posts");
        }

        if (payload.length < 1) {
          throw new Error("No posts found for the user");
        }

        return payload;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    getcomments: async (_, { postId }, context) => {
      const userId = context.user.id;

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(postId)) {
        throw new Error("Invalid Post ID");
      }

      try {
        const comments = await fetchAllCommentsOnPost(postId);

        if (!comments) {
          throw new Error("Error fetching comments");
        }

        return comments;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    chatRoomChatList: async (_, { chatRoomId }, context) => {
      const userId = context.user.id;
      if (!userId) throw new Error("Unauthorized");

      const chatMsgList = await prisma.message.findMany({
        where: { chatRoomId },
        include: {
          chatRoom: true,
          sender: true,
        },
      });

      console.log("List of chat-msg ", Array.isArray(chatMsgList));

      console.log("List ", chatMsgList);

      return chatMsgList;
    },
    userChatRoomId: async (_, { userId }, context) => {
      const participantList = await prisma.participant.findMany({
        where: { userId: userId },
        include: {
          user: true,
          chatRoom: true,
        },
      });

      console.log("Participant list", participantList);

      return participantList;
    },
    friendChatList: async (_, { userId }, context) => {
      // const token = getToken(context);
      // if (!token) throw new AuthenticationError("Unauthorized");

      const friendList = await prisma.friendship.findMany({
        where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
        include: {
          user1: true,
          user2: true,
        },
      });

      console.log(
        "Get the List of ChatroomId is Array ",
        Array.isArray(friendList),
      );

      console.log("List: ", friendList);

      return friendList;
    },
  },
  Mutation: {
    // Mutation is like a router for GraphQL
    // And mutation work like POST
    signup: async (_, { name, email, password }) => {
      if (!isValidEmail(email)) {
        throw new Error("Invalid Email! Please provide a valid email address.");
      }

      if (!isValidName(name)) {
        throw new Error(
          "Invalid Name! Name must be at least 3 characters long.",
        );
      }

      if (!isValidPassword(password)) {
        throw new Error(
          "Invalid Password! Password must be at least 8 characters long.",
        );
      }

      try {
        const response = await createAccount(name, email, password);

        if (!response) {
          throw new Error("Signup failed! Please try again.");
        }

        return response;
      } catch (error) {
        console.log(`[SignUp Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
    login: async (_, { email, password }) => {
      if (!isValidEmail(email)) {
        throw new Error("Invalid Email! Please provide a valid email address.");
      }

      if (!isValidPassword(password)) {
        throw new Error(
          "Invalid Password! Password must be at least 8 characters long.",
        );
      }

      try {
        const response = await userLogin(email, password);

        if (!response) {
          throw new Error("Login failed! Please check your credentials.");
        }

        return response;
      } catch (error) {
        console.log(`[Login Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
    createpost: async (_, { title, content, category }, context) => {
      const userId = context.user.id;

      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!category) {
        throw new Error("Category is required");
      }

      if (!title) {
        throw new Error("Title is required");
      }

      if (!content) {
        throw new Error("Content is required");
      }

      if (title.length < 5) {
        throw new Error("Title must be at least 5 characters long");
      }

      if (content.length < 5) {
        throw new Error("Content must be at least 5 characters long");
      }

      try {
        const payload = await createNewPost(title, content, category, userId);

        if (!payload) {
          throw new Error("Error creating post");
        }

        return payload;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    updatepost: async (_, { id, input }, context) => {
      const userId = context.user.id;

      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(id)) {
        throw new Error("Invalid Post ID");
      }

      if (input.length < 1) {
        throw new Error("Input is required");
      }

      try {
        const payload = await editPost(id, input, userId);

        if (!payload) {
          throw new Error("Error updating post");
        }
        return payload;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    deletepost: async (_, { id }, context) => {
      const userId = context.user.id;

      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(id)) {
        throw new Error("Invalid Post ID");
      }

      try {
        const payload = await deletePost(id, userId);

        if (!payload) {
          throw new Error("Error deleting post");
        }

        return payload;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    likepost: async (_, { postId }, context) => {
      const userId = context.user.id;

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(postId)) {
        throw new Error("Invalid Post ID");
      }

      try {
        const payload = await likePost(postId, userId);

        if (!payload) {
          throw new Error("Error liking post");
        }

        return {
          liked: !!payload,
          message: "User liked post successfully!",
        };
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    updateprofile: async (_, { input }, context) => {
      const userId = context.user.id;

      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      try {
        const response = await updateUserProfile(input, userId);

        if (!response) {
          throw new Error("Error updating user profile");
        }

        return response;
      } catch (error) {
        console.log(`[Update Profile Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
    deleteuser: async (_, { id }, context) => {
      const userId = context.user.id;
      const role = context.user.role;

      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      if (!role) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!id) {
        throw new Error("User ID is required");
      }

      if (!isValidUUID(id)) {
        throw new Error("Invalid User ID");
      }

      try {
        const response = await deleteUserById(id, userId, role);

        if (!response) {
          throw new Error("Error Deactivating user");
        }

        return response;
      } catch (error) {
        console.log(`[Delete User Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
    createcomment: async (_, { comment, postId }, context) => {
      const userId = context.user.id;

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(postId)) {
        throw new Error("Invalid Post ID");
      }

      if (!comment || comment.toString().length < 1) {
        throw new Error("Comment must not be empty");
      }

      try {
        const comment = await createNewComment(comment, postId, userId);

        if (!comment) {
          throw new Error("Error creating comment");
        }

        return comment;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    updatecomment: async (_, { comment, commentId }, context) => {
      const userId = context.user.id;

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(commentId)) {
        throw new Error("Invalid Comment ID");
      }

      if (!comment || comment.toString().length < 1) {
        throw new Error("Comment must not be empty");
      }

      try {
        const updatedComment = await editComment(comment, commentId, userId);

        if (!updatedComment) {
          throw new Error("Error updating comment");
        }

        return updatedComment;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    deletecomment: async (_, { commentId }, context) => {
      const userId = context.user.id;

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(commentId)) {
        throw new Error("Invalid Comment ID");
      }

      try {
        const deletedComment = await revokedComment(commentId, userId);

        if (!deletedComment) {
          throw new Error("Error deleting comment");
        }

        return deletedComment;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    likecomment: async (_, { postId, commentId }, context) => {
      const userId = context.user.id;

      if (!isValidUUID(userId)) {
        throw new Error("Unauthorized Access");
      }

      if (!isValidUUID(postId)) {
        throw new Error("Invalid Post ID");
      }

      if (!isValidUUID(commentId)) {
        throw new Error("Invalid Comment ID");
      }

      try {
        const likeOrUnlike = await toggleCommentLike(commentId, userId, postId);

        if (!likeOrUnlike) {
          throw new Error("Error toggling like on comment");
        }

        return likeOrUnlike;
      } catch (error) {
        throw new Error("Internal Server Error!");
      }
    },
    friendSendRequest: async (_, { receiverId }, context) => {
      const userId = context.user.id;
      try {
        if (!isValidUUID(userId)) {
          throw new Error("Unauthorized Access");
        }

        if (!isValidUUID(receiverId)) {
          throw new Error("Invalid Receiver ID");
        }

        const payload = await sendFriendRequest(userId, receiverId);

        return payload;
      } catch (error) {
        console.log("[Friend Request Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    friendAcceptRequest: async (_, { requestId }, context) => {
      try {
        if (!isValidUUID(requestId)) {
          throw new Error("Invalid Request ID");
        }

        const payload = await acceptFriendRequest(requestId);

        return payload;
      } catch (error) {
        console.log("[Accept Friend Request Error]: ", error.message);
        throw new Error(error.message);
      }
    },

    activateChatRoom: async (_, { targetUserId }, context) => {
      try {
        const userId = context.user.id;
        if (!userId) throw new Error("Unauthorized");

        if (!isValidUUID(targetUserId)) {
          throw new Error("Invalid Target User ID");
        }

        const payload = await chatRoomActivate(user, targetUserId);

        return {
          id: payload.id,
          isGroup: payload.isGroup,
        };
      } catch (error) {
        console.log("[Chat Room Activation Failed]: ", error.message);
        throw new Error(error.message);
      }
    },
    textMessage: async (_, { chatRoomId, content }, context) => {
      const userId = context.user.id;
      if (!userId) throw new Error("Unauthorized");

      const msg = await prisma.message.create({
        data: {
          content,
          chatRoom: { connect: { id: chatRoomId } },
          sender: { connect: { id: userId } },
        },
        include: {
          sender: true,
          chatRoom: true,
        },
      });

      await pubsub.publish(`CHAT_${chatRoomId}`, {
        activeChat: msg,
      });
      return {
        id: msg.id,
        content: msg.content,
        chatRoom: msg.chatRoom,
        sender: msg.sender,
      };
    },
    iNotify: async (_, { id }, context) => {
      const userId = context.user.id;
      if (!userId) throw new Error("Unauthorized");

      const notify = await prisma.notification.findUnique({
        where: { id },
      });

      if (notify.toUserId !== userId) throw new Error("Unauthorized");
      return await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
    },
  },
  Subscription: {
    friendSentRequest: {
      subscribe: () => pubsub.asyncIterator(FRIEND_REQUEST_SENT),
    },
    friendAcceptedRequest: {
      subscribe: () => pubsub.asyncIterator(FRIEND_REQUEST_ACCEPTED),
    },
    activeChat: {
      subscribe: (_, { chatRoomId }) => {
        return pubsub.asyncIterator(`CHAT_${chatRoomId}`);
      },
    },
    iNotified: {
      subscribe: (_, { userId }) => {
        return pubsub.asyncIterator(`notify:${userId}`);
      },
      resolve: (payload) => {
        if (!payload || !payload.iNotified || !payload.iNotified.id) {
          throw new Error("Invalid payload for activeNotify subscription");
        }
        return payload.iNotified;
      },
    },
  },
};

module.exports = resolvers;
// }

// function checkIsAdmin(context) {
//   const token = context.token;
//   try {
//     const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(verifiedToken.role);
//     return verifiedToken.role;
//   } catch (err) {
//     return null;
//   }
// }

// async function createNotification({
//   type,
//   fromUserId,
//   toUserId,
//   postId = null,
// }) {
//   if (fromUserId === toUserId) return null;

//   const notify = await prisma.notification.create({
//     data: { type, fromUserId, toUserId, postId },
//   });

//   return notify;
// }

// async function updateNotification({
//   id,
//   type,
//   fromUserId,
//   toUserId,
//   postId = null,
// }) {
//   console.log("Update test: ", type, fromUserId, toUserId);

//   if (fromUserId === toUserId) return null;

//   const notify = await prisma.notification.update({
//     where: { id },
//     data: { type },
//   });
// }
