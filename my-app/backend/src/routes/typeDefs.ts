// File: backend/src/schema/typeDefs.js
import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  # type Post {
  #   id: ID!
  #   title: String!
  #   content: String!
  #   category: String!
  #   author: User!
  #   createdAt: DateTime!
  # }

  # type Notification {
  #   id: String!
  #   type: String!
  #   fromUser: User!
  #   toUser: User!
  #   post: Post
  #   isRead: Boolean!
  #   notifiedAt: String!
  # }

  # type ChatRoom {
  #   id: String!
  #   isGroup: Boolean
  #   participants: [Participant!]
  #   messages: [Message!]
  # }

  # type Participant {
  #   id: String!
  #   user: User!
  #   chatRoom: ChatRoom
  # }

  # type FriendRequest {
  #   id: String!
  #   sender: User!
  #   receiver: User!
  #   isAccepted: Boolean
  # }

  # type RequestAccepted {
  #   isAccepted: Boolean
  # }

  # type ChatRoomPayload {
  #   id: String!
  # }

  # type Comment {
  #   id: ID!
  #   comment: String!
  #   authorId: String!
  #   postId: String!
  # }

  # type User {
  #   id: String!
  #   name: String!
  #   email: String
  #   createdAt: String
  # }

  # type AuthPayload {
  #   user: User
  #   token: String
  # }

  # type PostPayload {
  #   post: Post
  #   message: String
  # }

  # type Message {
  #   id: String!
  #   content: String!
  #   sender: User!
  #   chatRoom: ChatRoom!
  # }

  # type InvitationRequestPayload {
  #   id: String!
  #   senderId: String!
  #   sender: User!
  #   requestedAt: DateTime!
  # }

  # type FriendRequestPayload {
  #   message: String!
  #   response: Boolean
  # }

  # type CommentPayload {
  #   token: String!
  #   mycomment: Comment!
  # }

  # type CommentsPayload {
  #   token: String!
  #   mycomment: [Comment!]!
  # }

  # type LikeResponse {
  #   liked: Boolean!
  #   message: String!
  # }

  # type Friendship {
  #   id: String!
  #   user1: User!
  #   user2: User!
  # }

  # type Counts {
  #   count: Int!
  # }

  # type DeactivateUserPayload {
  #   status: String!
  #   message: String!
  # }

  # type ChatRoomParticipantList {
  #   chatroomId: String!
  #   participants: Participant!
  # }

  # type FriendsPayload {
  #   id: String!
  #   user: User
  #   createdAt: String!
  # }

  # input UpdateUserInput {
  #   name: String
  #   email: String
  # }

  # union EventPayload = Message | FriendRequest | Notification

  # type LiveEvent {
  #   action: String!
  #   createdAt: String!
  #   data: EventPayload!
  # }

  # input UpdatePostInput {
  #   title: String
  #   content: String
  #   category: String
  # }

  # type UserLoad {
  #   name: String
  #   email: String
  #   password: String
  # }

  # type UserOTPayload {
  #   status: String
  # }

  # input UserInput {
  #   name: String!
  #   email: String!
  #   password: String!
  # }


  # User Inputs
  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input ProfileInput {
    name: String!
    email: String!
    # Other profile properties
  }


  # Post Inputs
  input PostInput {
    title: String
    content: String
    category: String
  }





  # User Types
  type User {
    id: String
    name: String
    email: String
    createdAt: String
  }

  type UserAuthPayload {
    user: User
    token: String
  }

  type UserOTPPayload {
    status: String
  }

  type ProfilePayload {
    name: String
    email: String
  }


  # Post Types
  type Post {
    id: String
    title: String
    content: String
    authorId: String
    createdAt: String
    author: User
  }








  type Query {
    # hello: String!
    # getPosts: [Post]
    # getpostById(id: String!): PostPayload
    # getAllPostByUID: [PostPayload]
    # getcomments(postId: String!): CommentsPayload
    # getNotification: [Notification!]!
    # friendChatList: [Friendship!]!
    # chatRoomChatList(chatRoomId: String): [Message!]!
    # userChatRoomId: [ChatRoomParticipantList!]!
    # listOfReceivedFriendRequest: [FriendsPayload]
    # listOfSentFriendRequest: [FriendsPayload]
    # searchFriends(friendName: String!): [User]
    # listOfFollowers: [FriendsPayload]
    # listOfFollowings: [FriendsPayload]
    # getRoomMemberProfile(chatRoomId: String!): Participant
    # followersCount: Counts
    # followingsCount: Counts





    # User Query
    loginUpUser(email: String!, password: String!): UserAuthPayload

    requestForPasswordReset: UserOTPPayload

    getAllUserData: User


    # Post Query
    getPostsByUserId(userId: String!): [Post]

    getPostByPostId(postId: String!): Post

    searchPost(text: String!): Post
  }

  type Mutation {
    # User Mutation
    signUpUser(input: SignupInput): UserOTPPayload

    codeVerification(email: String!, OTP: String!): UserAuthPayload

    resetPassword(userId: String, password: String!): UserOTPPayload

    updateProfile(input: ProfileInput): ProfilePayload


    # Post Mutation
    createPost(input: PostInput): Post

    editPost(input: PostInput): Post






    # googleAuthExchangeToken(token: String!): AuthPayload
    # githubAuthExchangeToken(token: String!): AuthPayload

    # deleteuser(id: String!): DeactivateUserPayload

    # createpost(title: String!, content: String!, category: String!): PostPayload
    # likepost(postId: ID!): LikeResponse!
    # updatepost(id: String!, input: UpdatePostInput): PostPayload
    # deletepost(id: String!): Message

    # createcomment(comment: String!, postId: String!): CommentPayload
    # updatecomment(comment: String!, commentId: String!): CommentPayload
    # deletecomment(commentId: String!): Message

    # likecomment(postId: ID!, commentId: ID!): LikeResponse

    # friendSendRequest(receiverId: String!): FriendRequestPayload
    # friendRequestResponse(
    #   requestId: String!
    #   responseCode: String!
    # ): FriendRequestPayload

    # activateChatRoom(targetUserId: String!): ChatRoomPayload!
    # textMessage(chatRoomId: String!, content: String!): Message!

    # iNotify(id: String!): Notification
  }

  # type Subscription {
  #   onUserEvent: LiveEvent!
  # }
`;
