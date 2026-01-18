// File: backend/src/resolvers/index.js
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AuthenticationError,
  UserInputError,
  ValidationError,
} from "apollo-server-express";
import prisma from "../config/prismaConfig.js";
import {
  FRIEND_REQUEST_ACCEPTED,
  FRIEND_REQUEST_SENT,
} from "../config/pubsub.js";
import pubsub from "../subscription/pubsub.js";
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
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      return await prisma.notification.findMany({
        where: { toUserId: userId },
        orderBy: { notifiedAt: "desc" },
      });
    },
    getpost: async (_, { id }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      const post = await prisma.post.findUnique({
        where: {
          id,
        },
      });

      return {
        post,
      };
    },
    getcomments: async (_, { postId }, context) => {
      const token = getToken(context);
      if (!token) throw new AuthenticationError("Priveledged violation!");

      const mycomment = await prisma.comment.findMany({
        where: {
          postId,
        },
      });
      return {
        token,
        mycomment,
      };
    },
    chatRoomChatList: async (_, { chatRoomId }, context) => {
      const token = getToken(context);
      if (!token) throw new AuthenticationError("Unauthorized");

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
        Array.isArray(friendList)
      );

      console.log("List: ", friendList);

      return friendList;
    },
  },
  Mutation: {
    // Mutation is like a router for GraphQL
    // And mutation work like POST
    signup: async (_, { name, email, password }) => {
      if (
        !name ||
        !email ||
        !password ||
        name === "" ||
        email === "" ||
        password === ""
      ) {
        throw new UserInputError(
          "Invalid User Credentials! Please fill required Fields"
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET
      );

      return {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      };
    },
    login: async (_, { email, password }) => {
      if (!email || !password || email === "" || password === "") {
        throw new UserInputError(
          "Invalid User Credentials! Please fill required Fields"
        );
      }

      const reqUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!reqUser) throw new ValidationError("Invalid User");

      const valid = await bcrypt.compare(password, reqUser.password);
      if (!valid) throw new ValidationError("Invalid Password");

      const token = jwt.sign(
        { userId: reqUser.id, role: reqUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      if (!token) {
        throw new AuthenticationError("UnAuthentic Account");
      }
      return {
        token,
        user: {
          id: reqUser.id,
          name: reqUser.name,
          email: reqUser.email,
          createdAt: reqUser.createdAt,
        },
      };
    },
    createpost: async (_, { title, content, category }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      const post = await prisma.post.create({
        data: {
          title,
          content,
          category,
          authorId: userId,
        },
        include: {
          author: true,
        },
      });
      return {
        post: {
          id: userId,
          title,
          content,
          category,
        },
      };
    },
    updatepost: async (_, { id, title, content, category }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      const data = {};
      if (title) {
        data["title"] = title;
      }
      if (content) {
        data["content"] = content;
      }

      if (category) {
        data["category"] = category;
      }

      const post = await prisma.post.update({
        where: { id },
        data,
      });
      return {
        post,
      };
    },
    deletepost: async (_, { id }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      const post = await prisma.post.delete({
        where: { id },
      });

      return {
        message: "Post deleted Successfully",
      };
    },
    likepost: async (_, { postId }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      const token = getToken(context);
      if (!token) throw new AuthenticationError("Priviledged violation!");

      try {
        const existing = await prisma.postLike.findUnique({
          where: {
            userId_postId: { userId, postId },
          },
        });

        if (existing) {
          const dislike = await prisma.postLike.delete({
            where: {
              id: existing.id,
            },
          });

          const likeCount = await prisma.postLike.count({
            where: {
              postId,
            },
          });

          const setPostLikes = await prisma.post.update({
            where: {
              id: postId,
            },
            data: {
              likeCount,
            },
          });
          return { liked: false };
        } else {
          const like = await prisma.postLike.create({
            data: {
              userId,
              postId,
            },
          });

          const likeCount = await prisma.postLike.count({
            where: {
              postId,
            },
          });

          const setPostLikes = await prisma.post.update({
            where: {
              id: postId,
            },
            data: {
              likeCount,
            },
          });

          return { liked: true };
        }
      } catch (err) {
        throw new Error("Internal Server Error");
      }
    },
    updateprofile: async (_, { name, email }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      const data = {};

      if (name) {
        data["name"] = name;
      }

      if (email) {
        data["email"] = email;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data,
      });

      const token = getToken(context);
      if (!token) throw new AuthenticationError("Priviledged violation");

      return {
        token,
        user,
      };
    },
    deleteuser: async (_, { id }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      const isAdmin = checkIsAdmin(context);
      if (
        isAdmin === undefined ||
        isAdmin === null ||
        isAdmin === "" ||
        !isAdmin ||
        isAdmin.toLowerCase() === "user"
      )
        throw new AuthenticationError("Unauthorized");

      await prisma.user.delete({
        where: { id },
      });

      return {
        message: "User removed Successfully",
      };
    },
    createcomment: async (_, { comment, postId }, context) => {
      const authorId = getUserIdFromToken(context);
      if (!authorId) throw new AuthenticationError("Unauthorized");

      const token = getToken(context);
      if (!token) throw new AuthenticationError("Priviledged violation!");

      const mycomment = await prisma.comment.create({
        data: { comment, postId, authorId },
      });

      return {
        token,
        mycomment,
      };
    },
    updatecomment: async (_, { comment, id }, context) => {
      const authorId = getUserIdFromToken(context);
      if (!authorId) throw new AuthenticationError("Unauthorized");

      const token = getToken(context);
      if (!token) throw new AuthenticationError("Priveledged violation!");

      const mycomment = await prisma.comment.update({
        where: {
          id,
        },
        data: {
          comment,
        },
      });

      return {
        token,
        mycomment,
      };
    },
    deletecomment: async (_, { id }, context) => {
      const authorId = getUserIdFromToken(context);
      if (!authorId) throw new AuthenticationError("Unauthorized");

      const token = getToken(context);
      if (!token) throw new AuthenticationError("Priveledged violation!");

      await prisma.comment.delete({
        where: { id },
      });

      return {
        message: "Comment deleted Successfully!",
      };
    },
    likecomment: async (_, { postId, commentId }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      try {
        const existing = await prisma.commentLike.findUnique({
          where: {
            userId_postId_commentId: { userId, postId, commentId },
          },
        });

        if (existing) {
          const dislike = await prisma.commentLike.delete({
            where: { id: existing.id },
          });

          const likeCount = await prisma.commentLike.count({
            where: {
              commentId,
            },
          });

          const setCommentLike = await prisma.comment.update({
            where: {
              id: commentId,
            },
            data: { likeCount },
          });

          return {
            liked: false,
          };
        } else {
          const like = await prisma.commentLike.create({
            data: {
              userId,
              postId,
              commentId,
            },
          });

          const likeCount = await prisma.commentLike.count({
            where: {
              commentId,
            },
          });

          const setCommentLike = await prisma.comment.update({
            where: {
              id: commentId,
            },
            data: { likeCount },
          });

          return {
            liked: true,
          };
        }
      } catch (error) {
        throw new Error("Internal Server Error!");
      }
    },
    friendSendRequest: async (_, { receiverId }, context) => {
      const senderId = getUserIdFromToken(context);
      if (!senderId) throw new AuthenticationError("Unauthorized");

      const req = await prisma.friendRequest.create({
        data: { senderId, receiverId, type: "FRIEND_REQUEST_SENT" },
      });

      console.log(req, "\n Request is saved successfully");

      const notification = await createNotification({
        type: "CHAT_ROOM_ACTIVATED",
        toUserId: receiverId,
        fromUserId: senderId,
      });

      console.log("activate chat");

      console.log(notification);
      console.log("targetuserId", receiverId);

      pubsub.publish(`notify:${receiverId}`, {
        iNotified: notification,
      });

      // real-time publish (online user) --> When user1 is send request user2 notify
      await pubsub.publish(FRIEND_REQUEST_SENT, {
        friendSentRequest: { req },
      });
    },
    friendAcceptRequest: async (_, { requestId }, context) => {
      const reqAccept = await prisma.friendRequest.update({
        where: { id: requestId },
        data: {
          isAccepted: true,
          acceptedAt: new Date(),
          type: "FRIEND_REQUEST_ACCEPTED",
        },
      });

      const getUserInfo = await prisma.friendRequest.findUnique({
        where: { id: requestId },
      });

      const isFriend = await prisma.friendship.findFirst({
        where: {
          OR: [
            { user1Id: getUserInfo.senderId, user2Id: getUserInfo.receiverId },
            { user1Id: getUserInfo.receiverId, user2Id: getUserInfo.senderId },
          ],
        },
      });

      if (!isFriend) {
        const stabilizedFriendship = await prisma.friendship.create({
          data: {
            user1Id: getUserInfo.senderId,
            user2Id: getUserInfo.receiverId,
          },
        });

        console.log(
          stabilizedFriendship,
          "\n Friendship is accepted successfully"
        );

        await pubsub.publish(FRIEND_REQUEST_ACCEPTED, {
          friendAcceptedRequest: {
            reqAccept,
          },
        });
        console.log("All done successfully");
      } else {
        console.log("Friendship already exists!");
      }
    },

    activateChatRoom: async (_, { targetUserId }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

      const isChatRoomExist = await prisma.chatRoom.findFirst({
        where: {
          isGroup: false,
          participants: {
            some: {
              userId,
            },
          },
          AND: {
            participants: {
              some: {
                userId: targetUserId,
              },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (isChatRoomExist) {
        const notification = await createNotification({
          type: "CHAT_ROOM_ACTIVATED",
          toUserId: targetUserId,
          fromUserId: userId,
        });

        console.log("activate chat");

        console.log(notification);
        console.log("targetuserId", targetUserId);

        pubsub.publish(`notify:${targetUserId}`, {
          iNotified: notification,
        });

        return {
          id: isChatRoomExist.id,
        };
      }

      const startChatRoom = await prisma.chatRoom.create({
        data: {
          isGroup: false,
          participants: {
            create: [
              { user: { connect: { id: userId } } },
              { user: { connect: { id: targetUserId } } },
            ],
          },
        },
        include: {
          participants: true,
        },
      });

      const notification = await createNotification({
        type: "CHAT_ROOM_ACTIVATED",
        toUserId: targetUserId,
        fromUserId: userId,
      });

      console.log("activate chat");

      console.log(notification);
      console.log("targetuserId", targetUserId);

      pubsub.publish(`notify:${targetUserId}`, {
        iNotified: notification,
      });

      return {
        id: startChatRoom.id,
        isGroup: startChatRoom.isGroup,
      };
    },
    textMessage: async (_, { chatRoomId, content }, context) => {
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

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
      const userId = getUserIdFromToken(context);
      if (!userId) throw new AuthenticationError("Unauthorized");

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

function getToken(context) {
  const token = context.token;
  return token;
}

function getUserIdFromToken(context) {
  const token = context.token;
  console.log(token);
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifiedToken);
    return verifiedToken.userId;
  } catch (err) {
    return null;
  }
}

function checkIsAdmin(context) {
  const token = context.token;
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifiedToken.role);
    return verifiedToken.role;
  } catch (err) {
    return null;
  }
}

async function createNotification({
  type,
  fromUserId,
  toUserId,
  postId = null,
}) {
  if (fromUserId === toUserId) return null;

  const notify = await prisma.notification.create({
    data: { type, fromUserId, toUserId, postId },
  });

  return notify;
}

async function updateNotification({
  id,
  type,
  fromUserId,
  toUserId,
  postId = null,
}) {
  console.log("Update test: ", type, fromUserId, toUserId);

  if (fromUserId === toUserId) return null;

  const notify = await prisma.notification.update({
    where: { id },
    data: { type },
  });
}

export default resolvers;
