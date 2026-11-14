// File: backend/src/resolvers/index.js
// const { prisma } = require("../config/prismaConfig");
// const pubsub = require("../config/pubsub");
// const {
//   retriveAllPostByUserId,
//   retrivePostByPostId,
//   createNewPost,
//   retrivePostData,
//   retriveAllPosts,
// } = require("../services/PostServices");
// const {
//   isValidEmail,
//   isValidPassword,
//   isValidName,
//   isValidUUID,
// } = require("../utils/UserUtils");
// const {
//   userLogin,
//   createAccount,
//   searchFriendByName,
//   verifyUserAccount,
//   googleAuth,
//   githubAuth,
//   resetPassword,
// } = require("../services/UserAuthServices");
// const {
//   deleteUserById,
//   updateUserProfile,
//   retriveUserData,
// } = require("../services/UserServices");
// const {
//   fetchAllCommentsOnPost,
//   createNewComment,
//   editComment,
//   revokedComment,
//   toggleCommentLike,
// } = require("../services/CommentService");
// const {
//   sendFriendRequest,
//   retriveReceivedFriendRequestList,
//   retriveSentFriendRequestList,
//   setFriendRequestResponse,
// } = require("../services/FriendRequestServices");
// const {
//   chatRoomActivate,
//   retriveAllParticipantsList,
//   retrieveRoomMemberData,
//   retrieveUserChatData,
// } = require("../services/ChatServices");
// const {
//   retriveNotification,
//   updateNotification,
// } = require("../services/NotificationService");
// const {
//   findFriendChatList,
//   myFollowers,
//   myFollowings,
//   myFollowersCount,
//   myFollowingCount,
// } = require("../services/ExploreFriendServices");
// const { userEventSubs } = require("../services/SubscriptionService");
// const { GraphQLScalarType, Kind } = require("graphql");
// const { sendTextMessage } = require("../services/TextServices");

import { GraphQLContext } from "../types/context";

// import { subscribeToNotify } from "../utils/subscriber.js";
// import { GraphQLScalarType } from "graphql";

export const resolvers = {
  // DateTime: new GraphQLScalarType({
  //   name: "DateTime",
  //   description: "A custom scalar type for DateTime values",
  //   parseValue(value) {
  //     return new Date(value);
  //   },
  //   serialize(value) {
  //     return value instanceof Date
  //       ? value.toISOString()
  //       : new Date(value).toISOString();
  //   },
  //   parseLiteral(ast) {
  //     return ast.kind === Kind.STRING ? new Date(ast.value) : null;
  //   },
  // }),
  // Notification: {
  //   fromUser: async (parent, _) => {
  //     const userId = parent.fromUserId;

  //     if (!userId) {
  //       throw new Error("Invalid fromUserId in notification");
  //     }

  //     try {
  //       const payload = await retriveUserData(userId);

  //       if (!payload) {
  //         throw new Error("Failed to retrieve user data for notification");
  //       }

  //       return payload;
  //     } catch (error) {
  //       console.log(`[Notification Resolver Error]: ${error.message}`);
  //       throw new Error(error.message);
  //     }
  //   },
  //   toUser: async (parent, _) => {
  //     const userId = parent.toUserId;

  //     if (!userId) {
  //       throw new Error("Invalid fromUserId in notification");
  //     }

  //     try {
  //       const payload = await retriveUserData(userId);

  //       if (!payload) {
  //         throw new Error("Failed to retrieve user data for notification");
  //       }

  //       return payload;
  //     } catch (error) {
  //       console.log(`[Notification Resolver Error]: ${error.message}`);
  //       throw new Error(error.message);
  //     }
  //   },
  //   post: async (parent, _) => {
  //     const postId = parent.postId;

  //     if (!postId) {
  //       return null; // No post associated with this notification
  //     }

  //     try {
  //       const payload = await retrivePostData(postId);

  //       if (!payload) {
  //         throw new Error("Failed to retrieve post data for notification");
  //       }

  //       return payload;
  //     } catch (error) {
  //       console.log(`[Notification Resolver Error]: ${error.message}`);
  //       throw new Error(error.message);
  //     }
  //   },
  // },
  Query: {
    // User Query
    loginUpUser: async (
      parent: null,
      { email, password },
      { services }: GraphQLContext,
    ) => {
      return services.user.validateUser(email, password);
    },

    requestForPasswordReset: async (
      parent: null,
      inputs: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.user.requestForPasswordReset(user.id);
    },

    getAllUserData: async (
      parent: null,
      inputs: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.user.retriveProfile(user.id);
    },

    // Post Query
    getPostsByUserId: async (
      parent: null,
      { userId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.post.retriveEntirePostsOfAuthor(userId);
    },

    getPostByPostId: async (
      parent: null,
      { postId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.post.retrivePostByPostId(postId);
    },

    searchPost: async (
      parent: null,
      { text },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.post.searchPost(text);
    },

    // FRIEND_REQUEST Query
    getFriendRequestsListOfUser: async (
      parent: null,
      inputs: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.friendRequest.fetchFriendRequestsById(user.id);
    },

    searchFriendRequestByName: async (
      parent: null,
      { name },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.friendRequest.fetchFriendRequestByName(name);
    },

    // FRIENDSHIP Query
    getListOfFollowers: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.friendship.fetchUserFollowers(user.id);
    },

    getListOfFollowings: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.friendship.fetchUserFollowings(user.id);
    },

    getFollowersCount: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.friendship.fetchFollowersCount(user.id);
    },

    getFollowingsCount: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.friendship.fetchFollowingsCount(user.id);
    },

    // Message Query
    retriveAllMessagesOfChatSpace: async (
      parent: null,
      { chatRoomId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.message.fetchAllMessagesOfChatRoom(chatRoomId, user.id);
    },

    // ChatRoom Query


    // Participant Query
    retriveAllChatRoomsOfUser: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.participant.fetchParticipantsRoomOfUser(user.id);
    },

    searchUserRoom: async (
      parent: null,
      { name },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.participant.searchParticipant(name);
    },

  },
  //   // Query work like GET
  //   hello: () => "Hello World! 🌍",
  //   getPosts: async (_, parent, context) => {
  //     try {
  //       const userId = context.user.id;

  //       if (!userId) throw new Error("Unauthorized");

  //       const payload = await retriveAllPosts();
  //       console.log(payload);

  //       return payload;
  //     } catch (error) {
  //       console.log("[Error retrive post: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   listOfFollowers: async (_, parent, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized");

  //     try {
  //       const payload = await myFollowers(userId);

  //       return payload;
  //     } catch (error) {
  //       console.log("[Error retrive my friends: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   listOfFollowings: async (_, parent, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized");

  //     try {
  //       const payload = await myFollowings(userId);
  //       return payload;
  //     } catch (error) {
  //       console.log("[Error retriving followings: ", error.message, "]");
  //       throw new Error(error.message);
  //     }
  //   },
  //   listOfReceivedFriendRequest: async (_, parent, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized");

  //     try {
  //       const payload = await retriveReceivedFriendRequestList(userId);

  //       return payload;
  //     } catch (error) {
  //       console.log("[Error retrive received friend request: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   listOfSentFriendRequest: async (_, parent, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized");

  //     try {
  //       const payload = await retriveSentFriendRequestList(userId);
  //       return payload;
  //     } catch (error) {
  //       console.log(`[Error retrive sent friend request: ${error.message}]`);
  //       throw new Error(error.message);
  //     }
  //   },
  //   followersCount: async (_, parent, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized");

  //     try {
  //       const payload = await myFollowersCount(userId);
  //       return { count: payload };
  //     } catch (error) {
  //       throw new Error(error.message);
  //     }
  //   },
  //   followingsCount: async (_, parent, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized");

  //     try {
  //       const payload = await myFollowingCount(userId);
  //       return { count: payload };
  //     } catch (error) {
  //       throw new Error(error.message);
  //     }
  //   },
  //   searchFriends: async (_, { friendName }, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized Access");
  //     if (!friendName || friendName.trim() === "") {
  //       throw new Error("Friend name must not be empty");
  //     }
  //     try {
  //       const payload = await searchFriendByName(friendName);

  //       return payload;
  //     } catch (error) {
  //       console.log("[Search Friends Error]: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   getNotification: async (_, parent, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized");

  //     try {
  //       const payload = await retriveNotification(userId);

  //       return payload;
  //     } catch (error) {
  //       console.log("[Get Notification Error]: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   getpostById: async (_, { id }, context) => {
  //     const userId = context.user.id;

  //     if (!userId) {
  //       throw new Error("Unauthorized Access");
  //     }

  //     if (!isValidUUID(userId)) {
  //       throw new Error("Unauthorized Access");
  //     }

  //     if (!isValidUUID(id)) {
  //       throw new Error("Invalid Post ID");
  //     }

  //     try {
  //       const payload = await retrivePostByPostId(id, userId);

  //       if (!payload) {
  //         throw new Error("Error retriving post");
  //       }

  //       return payload;
  //     } catch (error) {
  //       console.log("[Server Error]: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   getAllPostByUID: async (_, obj, context) => {
  //     const userId = context.user.id;
  //     if (!userId) {
  //       throw new Error("Unauthorized Access");
  //     }

  //     try {
  //       const payload = await retriveAllPostByUserId(userId);

  //       if (!payload) {
  //         throw new Error("Error retriving posts");
  //       }

  //       if (payload.length < 1) {
  //         throw new Error("No posts found for the user");
  //       }

  //       return payload;
  //     } catch (error) {
  //       console.log("[Server Error]: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   getcomments: async (_, { postId }, context) => {
  //     const userId = context.user.id;

  //     if (!isValidUUID(userId)) {
  //       throw new Error("Unauthorized Access");
  //     }

  //     if (!isValidUUID(postId)) {
  //       throw new Error("Invalid Post ID");
  //     }

  //     try {
  //       const comments = await fetchAllCommentsOnPost(postId);

  //       if (!comments) {
  //         throw new Error("Error fetching comments");
  //       }

  //       return comments;
  //     } catch (error) {
  //       console.log("[Server Error]: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   chatRoomChatList: async (_, { chatRoomId }, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized");

  //     try {
  //       const payload = await retrieveUserChatData(chatRoomId);
  //       return payload;
  //     } catch (error) {
  //       console.log("[Server Error]: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   userChatRoomId: async (_, parent, context) => {
  //     const userId = context.user.id;

  //     if (!userId) {
  //       throw new Error("Unauthorized Access");
  //     }

  //     try {
  //       const payload = await retriveAllParticipantsList(userId);

  //       if (!payload) {
  //         throw new Error("Failed to retrieve participants list.");
  //       }

  //       return payload;
  //     } catch (error) {
  //       console.log("[Server Error]: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   friendChatList: async (_, parent, context) => {
  //     const userId = context.user.id;

  //     if (!userId) {
  //       throw new Error("Unauthorized Access");
  //     }

  //     try {
  //       const payload = await findFriendChatList(userId);

  //       if (!payload) {
  //         throw new Error("Failed to retrieve friend chat list.");
  //       }

  //       return payload;
  //     } catch (error) {
  //       console.log("[Server Error]: ", error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   getRoomMemberProfile: async (_, { chatRoomId }, context) => {
  //     const userId = context.user.id;
  //     if (!userId) throw new Error("Unauthorized Access");

  //     try {
  //       const payload = await retrieveRoomMemberData(chatRoomId, userId);

  //       return payload;
  //     } catch (error) {
  //       console.log(error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  // },
  Mutation: {
    // Mutation is like a router for GraphQL
    // And mutation work like POST
    // resetUserPassword: async (_, { password }, context) => {
    //   const userId = context.user.id;
    //   if (!userId) throw new Error("Unauthorized user");

    //   if (!password || password.length < 8) {
    //     throw new Error("Invalid password. Please try again!");
    //   }

    //   try {
    //     const payload = await resetPassword(userId, password);

    //     return payload;
    //   } catch (error) {
    //     console.log("Error at password reset");
    //     throw new Error(error.message);
    //   }
    // },
    // githubAuthExchangeToken: async (_, { token }, context) => {
    //   if (!token) {
    //     throw new Error("Please provide github code");
    //   }

    //   try {
    //     const payload = await githubAuth(token);

    //     return payload;
    //   } catch (error) {
    //     console.log(`[Github Auth Error]: ${error.message}`);
    //     throw new Error(error.message);
    //   }
    // },
    // googleAuthExchangeToken: async (_, { token }, context) => {
    //   if (!token) {
    //     throw new Error("Please provide google code");
    //   }
    //   try {
    //     const payload = await googleAuth(token);

    //     return payload;
    //   } catch (error) {
    //     console.log(`[Google Auth Error]: ${error.message}`);
    //     throw new Error(error.message);
    //   }
    // },

    // User Resolvers
    signUpUser: async (
      parent: null,
      { input },
      { services }: GraphQLContext,
    ) => {
      const { name, email, password } = input;
      return services.user.registerUser(name, email, password);
    },

    updateProfile: async (
      parent: null,
      { input },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.user.updateProfile({ ...input, id: user.id });
    },

    codeVerification: async (
      parent: null,
      { email, OTP },
      { services }: GraphQLContext,
    ) => {
      return services.user.verifyOTP(email, OTP);
    },

    resetPassword: async (
      parent: null,
      { userId, password },
      { services }: GraphQLContext,
    ) => {
      return services.user.resetPassword(userId, password);
    },

    // POST Mutation
    createPost: async (
      parent: null,
      { input },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.post.createPost({ ...input, authorId: user.id });
    },

    editPost: async (
      parent: null,
      { input },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.post.updatePost(input);
    },

    // FRIEND_REQUEST Mutation
    sendFriendRequest: async (
      parent: null,
      { input },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Enity");

      return services.friendRequest.sendFriendRequest(input);
    },

    resolveFriendRequest: async (
      parent: null,
      { requestId, response },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.friendRequest.interpretFriendRequestResponse(
        requestId,
        response,
      );
    },

    // Messages Mutation
    sendMessage: async (
      parent: null,
      { content, chatRoomId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.message.sendMessage(content, user.id, chatRoomId);
    },

    editMessage: async (
      parent: null,
      { id, content, chatRoomId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.message.editMessage(id, content, user.id, chatRoomId);
    },

    // ChatRoom Mutation
    createChatSpace: async (
      parent: null,
      { receiverId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.chatRoom.createChatRoom(user.id, receiverId);
    },

    // createpost: async (_, { title, content, category }, context) => {
    //   const userId = context.user.id;

    //   if (!userId) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!category) {
    //     throw new Error("Category is required");
    //   }

    //   if (!title) {
    //     throw new Error("Title is required");
    //   }

    //   if (!content) {
    //     throw new Error("Content is required");
    //   }

    //   if (title.length < 5) {
    //     throw new Error("Title must be at least 5 characters long");
    //   }

    //   if (content.length < 5) {
    //     throw new Error("Content must be at least 5 characters long");
    //   }

    //   try {
    //     const payload = await createNewPost(title, content, category, userId);

    //     return payload;
    //   } catch (error) {
    //     console.log("[Server Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // updatepost: async (_, { id, input }, context) => {
    //   const userId = context.user.id;

    //   if (!userId) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(id)) {
    //     throw new Error("Invalid Post ID");
    //   }

    //   if (input.length < 1) {
    //     throw new Error("Input is required");
    //   }

    //   try {
    //     const payload = await editPost(id, input, userId);

    //     if (!payload) {
    //       throw new Error("Error updating post");
    //     }
    //     return payload;
    //   } catch (error) {
    //     console.log("[Server Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // deletepost: async (_, { id }, context) => {
    //   const userId = context.user.id;

    //   if (!userId) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(id)) {
    //     throw new Error("Invalid Post ID");
    //   }

    //   try {
    //     const payload = await deletePost(id, userId);

    //     if (!payload) {
    //       throw new Error("Error deleting post");
    //     }

    //     return payload;
    //   } catch (error) {
    //     console.log("[Server Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // likepost: async (_, { postId }, context) => {
    //   const userId = context.user.id;

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(postId)) {
    //     throw new Error("Invalid Post ID");
    //   }

    //   try {
    //     const payload = await likePost(postId, userId);

    //     if (!payload) {
    //       throw new Error("Error liking post");
    //     }

    //     return {
    //       liked: !!payload,
    //       message: "User liked post successfully!",
    //     };
    //   } catch (error) {
    //     console.log("[Server Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // updateprofile: async (_, { input }, context) => {
    //   const userId = context.user.id;

    //   if (!userId) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   try {
    //     const response = await updateUserProfile(input, userId);

    //     if (!response) {
    //       throw new Error("Error updating user profile");
    //     }

    //     return response;
    //   } catch (error) {
    //     console.log(`[Update Profile Error]: ${error.message}`);
    //     throw new Error(error.message);
    //   }
    // },
    // verifyAccount: async (_, { email, OTP }, context) => {
    //   if (!isValidEmail(email)) {
    //     throw new Error("Invalid Email! Please provide a valid email address.");
    //   }

    //   if (!OTP || OTP.trim() === "") {
    //     throw new Error("OTP must not be empty");
    //   }

    //   try {
    //     const response = await verifyUserAccount(email, OTP);
    //     if (!response) {
    //       throw new Error(
    //         "Account verification failed! Please check your OTP and try again.",
    //       );
    //     }
    //     return response;
    //   } catch (error) {
    //     console.log(`[Account Verification Error]: ${error.message}`);
    //     throw new Error(error.message);
    //   }
    // },
    // deleteuser: async (_, { id }, context) => {
    //   const userId = context.user.id;
    //   const role = context.user.role;

    //   if (!userId) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!role) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!id) {
    //     throw new Error("User ID is required");
    //   }

    //   if (!isValidUUID(id)) {
    //     throw new Error("Invalid User ID");
    //   }

    //   try {
    //     const response = await deleteUserById(id, userId, role);

    //     if (!response) {
    //       throw new Error("Error Deactivating user");
    //     }

    //     return response;
    //   } catch (error) {
    //     console.log(`[Delete User Error]: ${error.message}`);
    //     throw new Error(error.message);
    //   }
    // },
    // createcomment: async (_, { comment, postId }, context) => {
    //   const userId = context.user.id;

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(postId)) {
    //     throw new Error("Invalid Post ID");
    //   }

    //   if (!comment || comment.toString().length < 1) {
    //     throw new Error("Comment must not be empty");
    //   }

    //   try {
    //     const comment = await createNewComment(comment, postId, userId);

    //     if (!comment) {
    //       throw new Error("Error creating comment");
    //     }

    //     return comment;
    //   } catch (error) {
    //     console.log("[Server Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // updatecomment: async (_, { comment, commentId }, context) => {
    //   const userId = context.user.id;

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(commentId)) {
    //     throw new Error("Invalid Comment ID");
    //   }

    //   if (!comment || comment.toString().length < 1) {
    //     throw new Error("Comment must not be empty");
    //   }

    //   try {
    //     const updatedComment = await editComment(comment, commentId, userId);

    //     if (!updatedComment) {
    //       throw new Error("Error updating comment");
    //     }

    //     return updatedComment;
    //   } catch (error) {
    //     console.log("[Server Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // deletecomment: async (_, { commentId }, context) => {
    //   const userId = context.user.id;

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(commentId)) {
    //     throw new Error("Invalid Comment ID");
    //   }

    //   try {
    //     const deletedComment = await revokedComment(commentId, userId);

    //     if (!deletedComment) {
    //       throw new Error("Error deleting comment");
    //     }

    //     return deletedComment;
    //   } catch (error) {
    //     console.log("[Server Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // likecomment: async (_, { postId, commentId }, context) => {
    //   const userId = context.user.id;

    //   if (!isValidUUID(userId)) {
    //     throw new Error("Unauthorized Access");
    //   }

    //   if (!isValidUUID(postId)) {
    //     throw new Error("Invalid Post ID");
    //   }

    //   if (!isValidUUID(commentId)) {
    //     throw new Error("Invalid Comment ID");
    //   }

    //   try {
    //     const likeOrUnlike = await toggleCommentLike(commentId, userId, postId);

    //     if (!likeOrUnlike) {
    //       throw new Error("Error toggling like on comment");
    //     }

    //     return likeOrUnlike;
    //   } catch (error) {
    //     throw new Error("Internal Server Error!");
    //   }
    // },
    // friendSendRequest: async (_, { receiverId }, context) => {
    //   const userId = context.user.id;
    //   try {
    //     if (!isValidUUID(userId)) {
    //       throw new Error("Unauthorized Access");
    //     }

    //     if (!isValidUUID(receiverId)) {
    //       throw new Error("Invalid Receiver ID");
    //     }

    //     const payload = await sendFriendRequest(userId, receiverId);

    //     return {
    //       message: "Request sent successfully!",
    //       response: payload,
    //     };
    //   } catch (error) {
    //     console.log("[Friend Request Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // friendRequestResponse: async (_, { requestId, responseCode }, context) => {
    //   const userId = context.user.id;
    //   if (!userId) throw new Error("Unauthorized");
    //   try {
    //     const payload = await setFriendRequestResponse(
    //       requestId,
    //       responseCode,
    //       userId,
    //     );

    //     return {
    //       message:
    //         payload === true
    //           ? "Friend request accepted"
    //           : payload === false
    //             ? "Friend request rejected"
    //             : "Friend request revoked",
    //       response: payload === true ? true : payload === false ? false : null,
    //     };
    //   } catch (error) {
    //     console.log("[Accept Friend Request Error]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },

    // activateChatRoom: async (_, { targetUserId }, context) => {
    //   try {
    //     const userId = context.user.id;
    //     if (!userId) throw new Error("Unauthorized");

    //     const payload = await chatRoomActivate(userId, targetUserId);

    //     return {
    //       id: payload.id,
    //     };
    //   } catch (error) {
    //     console.log("[Chat Room Activation Failed]: ", error.message);
    //     throw new Error(error.message);
    //   }
    // },
    // textMessage: async (_, { chatRoomId, content }, context) => {
    //   const userId = context.user.id;
    //   if (!userId) throw new Error("Unauthorized");

    //   try {
    //     const message = await sendTextMessage(content, chatRoomId, userId);

    //     if (!message) {
    //       throw new Error("Failed to send the message.");
    //     }
    //     return message;
    //   } catch (error) {
    //     console.log(`[Text Message Error]: ${error.message}`);
    //     throw new Error(error.message);
    //   }
    // },
    // iNotify: async (_, { id }, context) => {
    //   const userId = context.user.id;
    //   if (!userId) throw new Error("Unauthorized");

    //   try {
    //     const payload = await updateNotification(id, userId);

    //     if (!payload) {
    //       throw new Error("Failed to update notification as read.");
    //     }

    //     return payload;
    //   } catch (error) {
    //     console.log(`[Notification Error]: ${error.message}`);
    //     throw new Error(error.message);
    //   }
    // },
  },
  Subscription: {
    // Work on Subscription to subscribe self
    onEvent: {
      subscribe: (
        root: null,
        input: null,
        { user, services }: GraphQLContext,
      ) => {
        const userId = user.id;

        if (!userId) {
          throw new Error("Unauthorized Entity");
        }

        try {
          const payload = services.subscription.event(userId);

          return payload;
        } catch (error) {
          console.log(`[Subscription Error]: ${error.message}`);
          throw new Error(error.message);
        }
      },
    },
  },
  EventPayload: {
    __resolveType(obj) {
      if (obj.__typename) {
        return obj.__typename;
      }

      if (obj.content && obj.chatRoom) {
        return "Message";
      }

      if (obj.isAccepted !== undefined) {
        return "FriendRequest";
      }

      if (obj.isRead !== undefined) {
        return "Notification";
      }
      return null;
    },
  },
};
