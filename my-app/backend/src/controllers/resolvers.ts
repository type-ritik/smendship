// File: backend/src/resolvers/index.js
import { GraphQLContext } from "../types/context";

export const resolvers = {
  Query: {
    // User Query
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

    searchUser: async (
      parent: null,
      { name },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.user.search(name);
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

    fetchMePosts: async (
      parent: null,
      { lastPostId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.post.retriveEntirePosts(lastPostId);
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

    getSentFriendRequestListOfUser: async (
      parent: null,
      inputs: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.friendRequest.fetchSentFriendRequestById(user.id);
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
      return services.message.fetchAllMessagesOfChatRoom(chatRoomId);
    },

    // ChatRoom Query
    retriveChatFriends: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.chatRoom.fetchUserChatRoomParticipants(user.id);
    },

    // Participant Query
    retriveAllChatRoomsOfUser: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.participant.fetchParticipantsRoomOfUser(user.id);
    },

    retriveUserProfileOfRoom: async (
      parent: null,
      { chatRoomId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.participant.fetchParticipantData(chatRoomId, user.id);
    },

    searchUserRoom: async (
      parent: null,
      { name },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");
      return services.participant.searchParticipant(name);
    },

    // Notification Query
    retriveUserNotifications: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.notification.getAllNotificationOfUser(user.id);
    },

    searchNotification: async (
      parent: null,
      { type },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.notification.searchNotification(type);
    },

    // Comment Query
    retriveCommentOf: async (
      parent: null,
      { id },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.comment.fetchCommentOf(id);
    },

    retriveCommentsOfPost: async (
      parent: null,
      { postId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.comment.fetchCommentsOfPost(postId);
    },

    // LikePost Query
    retriveLikesOfPost: async (
      parent: null,
      { postId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.likePost.fetchAllLikesOfPost(postId);
    },

    retriveLikePostsByUser: async (
      parent: null,
      input: null,
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.likePost.fetchAllLikeByUser(user.id);
    },

    retriveLikesCountOnPost: async (
      parent: null,
      { postId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.likePost.fetchPostLikesCount(postId);
    },
  },

  Mutation: {
    // Mutation is like a router for GraphQL
    // And mutation work like POST

    // User Mutation
    loginUpUser: async (
      parent: null,
      { email, password },
      { services }: GraphQLContext,
    ) => {
      return services.user.validateUser(email, password);
    },

    signUpUser: async (
      parent: null,
      { input },
      { services }: GraphQLContext,
    ) => {
      const { name, email, password } = input;
      return services.user.registerUser(name, email, password);
    },

    githubAuth: async (
      parent: null,
      { gitToken },
      { user, services }: GraphQLContext,
    ) => {
      return services.user.github(gitToken);
    },

    googleAuth: async (
      parent: null,
      { googleToken },
      { user, services }: GraphQLContext,
    ) => {
      return services.user.google(googleToken);
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

      return await services.post.createPost({ ...input, authorId: user.id });
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
      { receiverId },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Enity");

      return services.friendRequest.sendFriendRequest({
        receiverId,
        senderId: user.id,
        type: "FRIEND_REQUEST_SENT",
      });
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

    // Notification Mutation
    deleteNotification: async (
      parent: null,
      { id },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.notification.deleteNotification(id);
    },

    // Comment Mutation
    createComment: async (
      parent: null,
      { postId, comment },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.comment.createComment({
        postId,
        comment,
        authorId: user.id,
      });
    },

    editComment: async (
      parent: null,
      { id, comment },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.comment.editComment({ id, comment });
    },

    deleteComment: async (
      parent: null,
      { id },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.comment.deleteComment(id);
    },

    // Like Post Mutation
    likePost: async (
      parent: null,
      { postId, isLiked },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.likePost.likeIt({ userId: user.id, isLiked, postId });
    },

    unLikePost: async (
      parent: null,
      { id, isLiked },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.likePost.alterLike({ id, isLiked });
    },

    removeLikePost: async (
      parent: null,
      { id },
      { user, services }: GraphQLContext,
    ) => {
      if (!user.id) throw new Error("Unauthorized Entity");

      return services.likePost.removeLike(id);
    },
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
