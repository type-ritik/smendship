// File: backend/src/resolvers/index.js
// const { prisma } = require("../config/prismaConfig");
const pubsub = require("../subscription/pubsub");
const {
  retriveAllPostByUserId,
  retrivePostByPostId,
  createNewPost,
  retrivePostData,
  retriveAllPosts,
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
  retriveUserData,
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
const {
  chatRoomActivate,
  retriveAllParticipantsList,
  retriveAllChatroomChatList,
} = require("../services/ChatServices");
const {
  retriveNotification,
  updateNotification,
} = require("../services/NotificationService");
const { findFriendChatList } = require("../services/ExploreFriendServices");
const {
  friendRequestReceiveSubs,
  activeChatSubs,
  notifyUserSubs,
} = require("../services/SubscriptionService");
// import { subscribeToNotify } from "../utils/subscriber.js";

const resolvers = {
  Notification: {
    fromUserId: async (parent, _) => {
      const userId = parent.fromUserId;

      if (!userId) {
        throw new Error("Invalid fromUserId in notification");
      }

      try {
        const payload = await retriveUserData(userId);

        if (!payload) {
          throw new Error("Failed to retrieve user data for notification");
        }

        return payload;
      } catch (error) {
        console.log(`[Notification Resolver Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
    toUserId: async (parent, _) => {
      const userId = parent.toUserId;

      if (!userId) {
        throw new Error("Invalid fromUserId in notification");
      }

      try {
        const payload = await retriveUserData(userId);

        if (!payload) {
          throw new Error("Failed to retrieve user data for notification");
        }

        return payload;
      } catch (error) {
        console.log(`[Notification Resolver Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
    post: async (parent, _) => {
      const postId = parent.postId;

      if (!postId) {
        return null; // No post associated with this notification
      }

      try {
        const payload = await retrivePostData(postId);

        if (!payload) {
          throw new Error("Failed to retrieve post data for notification");
        }

        return payload;
      } catch (error) {
        console.log(`[Notification Resolver Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
  },
  Query: {
    // Query work like GET
    hello: () => "Hello World! 🌍",
    getPosts: async (_, parent, context) => {
      try {
        const userId = context.user.id;

        if (!userId) throw new Error("Unauthorized");

        const payload = await retriveAllPosts();
        console.log(payload);

        return payload;
      } catch (error) {
        console.log("[Error retrive post: ", error.message);
        throw new Error(error.message);
      }
    },
    getNotification: async (_, parent, context) => {
      const userId = context.user.id;
      if (!userId) throw new Error("Unauthorized");

      try {
        const payload = await retriveNotification(userId);

        return payload;
      } catch (error) {
        console.log("[Get Notification Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    getpostById: async (_, { id }, context) => {
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
    getAllPostByUID: async (_, obj, context) => {
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

      try {
        const payload = await retriveAllChatroomChatList(chatRoomId, userId);

        if (!payload) {
          throw new Error("Failed to retrieve chat list.");
        }

        return payload;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    userChatRoomId: async (_, parent, context) => {
      const userId = context.user.id;

      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      try {
        const payload = await retriveAllParticipantsList(useId);

        if (!payload) {
          throw new Error("Failed to retrieve participants list.");
        }

        return payload;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
    },
    friendChatList: async (_, parent, context) => {
      const userId = context.user.id;

      if (!userId) {
        throw new Error("Unauthorized Access");
      }

      try {
        const payload = await findFriendChatList(userId);

        if (!payload) {
          throw new Error("Failed to retrieve friend chat list.");
        }

        return payload;
      } catch (error) {
        console.log("[Server Error]: ", error.message);
        throw new Error(error.message);
      }
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

        return {
          message: "Request sent successfully!",
          response: payload,
        };
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

      try {
        const message = await sendTextMessage(content, chatRoomId, userId);

        if (!message) {
          throw new Error("Failed to send the message.");
        }
        return message;
      } catch (error) {
        console.log(`[Text Message Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
    iNotify: async (_, { id }, context) => {
      const userId = context.user.id;
      if (!userId) throw new Error("Unauthorized");

      try {
        const payload = await updateNotification(id, userId);

        if (!payload) {
          throw new Error("Failed to update notification as read.");
        }

        return payload;
      } catch (error) {
        console.log(`[Notification Error]: ${error.message}`);
        throw new Error(error.message);
      }
    },
  },
  Subscription: {
    // Work on Subscription to subscribe self
    friendRequestReceived: {
      subscribe: (_, { userId }) => {
        try {
          const payload = friendRequestReceiveSubs(userId);

          if (!payload) {
            throw new Error(
              "Failed to subscribe to friend request sent events.",
            );
          }

          return payload;
        } catch (error) {
          console.log(`[Subscription Error]: ${error.message}`);
          throw new Error(error.message);
        }
      },
    },
    activeChat: {
      subscribe: (_, { userId }) => {
        try {
          const payload = activeChatSubs(userId);

          if (!payload) {
            throw new Error("Failed to subscribe to active chats.");
          }

          return payload;
        } catch (error) {
          console.log(`[Subscription Error]: ${error.message}`);
          throw new Error(error.message);
        }
      },
    },
    iNotified: {
      subscribe: (_, { userId }, context) => {
        if (!userId) {
          throw new Error("Unauthorized Access");
        }

        try {
          const payload = notifyUserSubs(userId);

          if (!payload) {
            throw new Error(
              "Failed to subscribe to friend request accept events.",
            );
          }

          return payload;
        } catch (error) {
          console.log(`[Subscription Error]: ${error.message}`);
          throw new Error(error.message);
        }
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
