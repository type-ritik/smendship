// File: backend/src/schema/typeDefs.js
const { gql } = require("graphql-tag");

const typeDefs = gql`
  scalar DateTime
  scalar JSON

  type Post {
    id: ID!
    title: String!
    content: String!
    category: String!
    author: User!
    createdAt: DateTime!
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
    email: String
    createdAt: String
  }

  type AuthPayload {
    status: String
    message: String
    token: String
    user: User
  }

  type PostPayload {
    post: Post
    message: String
  }

  type Message {
    id: String!
    content: String!
    sender: User!
    chatRoom: ChatRoom!
  }

  type InvitationRequestPayload {
    id: String!
    senderId: String!
    sender: User!
    requestedAt: DateTime!
  }

  type FriendRequestPayload {
    message: String!
    response: Boolean
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
    message: String!
  }

  type Friendship {
    id: String!
    user1: User!
    user2: User!
  }

  type DeactivateUserPayload {
    status: String!
    message: String!
  }

  type UpdateProfilePayload {
    status: String!
    message: String!
    user: User
    lastUpdated: String
  }

  type FriendsPayload {
    id: String!
    user: User
    createdAt: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
  }

  input UpdatePostInput {
    title: String
    content: String
    category: String
  }

  type Query {
    hello: String!
    getPosts: [Post]
    getpostById(id: String!): PostPayload
    getAllPostByUID: [PostPayload]
    getcomments(postId: String!): CommentsPayload
    getNotification: [Notification!]!
    friendChatList: [Friendship!]!
    chatRoomChatList(chatRoomId: String): [Message!]!
    userChatRoomId: [Participant!]!
    listOfReceivedFriendRequest: [FriendsPayload]
    listOfSentFriendRequest: [FriendsPayload]
    searchFriends(friendName: String!): [User]
    listOfFollowers: [FriendsPayload]
    listOfFollowings: [FriendsPayload]
  }

  type Mutation {
    verifyAccount(email: String!, OTP: String!): AuthPayload
    resetUserPassword(password: String!): AuthPayload
    googleAuthExchangeToken(token: String!): AuthPayload
    githubAuthExchangeToken(token: String!): AuthPayload
    signup(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    updateprofile(input: UpdateUserInput): UpdateProfilePayload
    deleteuser(id: String!): DeactivateUserPayload

    createpost(title: String!, content: String!, category: String!): PostPayload
    likepost(postId: ID!): LikeResponse!
    updatepost(id: String!, input: UpdatePostInput): PostPayload
    deletepost(id: String!): Message

    createcomment(comment: String!, postId: String!): CommentPayload
    updatecomment(comment: String!, commentId: String!): CommentPayload
    deletecomment(commentId: String!): Message

    likecomment(postId: ID!, commentId: ID!): LikeResponse

    friendSendRequest(receiverId: String!): FriendRequestPayload
    friendRequestResponse(
      requestId: String!
      responseCode: String!
    ): FriendRequestPayload

    activateChatRoom(targetUserId: String!): ChatRoom!
    textMessage(chatRoomId: String!, content: String!): Message!

    iNotify(id: String!): Notification
  }

  type Subscription {
    friendRequestReceived(userId: String!): FriendRequestPayload
    activeChat(userId: String!): Message!
    iNotified(userId: String!): Notification
  }
`;

module.exports = typeDefs;
