// File: backend/src/schema/typeDefs.js
import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    category: String!
    authorId: String!
    createdAt: String!
  }

  type Notification {
    id: String!
    type: String!
    fromUserId: User!
    toUserId: User!
    post: Post
    isRead: Boolean!
    notifiedAt: String!
  }

  type Message {
    id: String!
    content: String!
    sender: User!
    chatRoom: ChatRoom!
  }

  type ChatRoom {
    id: String!
    isGroup: Boolean!
    participants: [Participant!]!
    messages: [Message!]!
  }

  type Participant {
    id: String!
    user: User!
    chatRoom: ChatRoom!
  }

  type FriendRequest {
    id: ID!
    senderId: User!
    receiverId: User!
    isAccepted: Boolean
  }

  type RequestAccepted {
    isAccepted: Boolean
  }

  type Comment {
    id: ID!
    comment: String!
    authorId: String!
    postId: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PostPayload {
    post: Post!
  }

  type Message {
    id: String!
    content: String!
    sender: User!
    chatRoom: ChatRoom!
  }

  type FriendRequestPayload {
    token: String!
    request: FriendRequest
  }

  type CommentPayload {
    token: String!
    mycomment: Comment!
  }

  type CommentsPayload {
    token: String!
    mycomment: [Comment!]!
  }

  type LikeResponse {
    liked: Boolean!
  }

  type Friendship {
    id: String!
    user1: User!
    user2: User!
  }

  type Query {
    hello: String!
    getpost(id: String!): PostPayload
    getcomments(postId: String!): CommentsPayload
    getNotification: [Notification!]!
    friendChatList(userId: String!): [Friendship!]!
    chatRoomChatList(chatRoomId: String): [Message!]!
    userChatRoomId(userId: String!): [Participant!]!
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    updateprofile(name: String, email: String): AuthPayload
    deleteuser(id: String!): Message

    createpost(title: String!, content: String!, category: String!): PostPayload
    likepost(postId: ID!): LikeResponse!
    updatepost(
      id: String!
      title: String
      content: String
      category: String
    ): PostPayload
    deletepost(id: String!): Message

    createcomment(comment: String!, postId: String!): CommentPayload
    updatecomment(id: String!, comment: String!): CommentPayload
    deletecomment(id: String!): Message

    likecomment(postId: ID!, commentId: ID!): LikeResponse

    friendSendRequest(receiverId: String!): FriendRequestPayload
    friendAcceptRequest(requestId: String!): FriendRequestPayload

    activateChatRoom(targetUserId: String!): ChatRoom!
    textMessage(chatRoomId: String!, content: String!): Message!

    iNotify(id: String!): Notification
  }

  type Subscription {
    friendSentRequest(receiverId: String!): FriendRequestPayload
    friendAcceptedRequest(
      fromUserId: String!
      toUserId: String!
    ): FriendRequestPayload
    activeChat(chatRoomId: String!): Message!
    iNotified(userId: String!): Notification
  }
`;

export default typeDefs;
