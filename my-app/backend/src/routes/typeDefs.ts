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
  enum REQUEST_TYPE {
    FRIEND_REQUEST_ACCEPTED
    FRIEND_REQUEST_REJECTED
    FRIEND_REQUEST_SENT
  }

  enum PARTICIPANT_ROLE {
    member
    creator
    admin
  }

  union EventPayload = MessagePayload | FriendRequestPayload

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

  # Post Inputs
  input PostInput {
    title: String
    content: String
    category: String
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

  # Friend_request Input
  input FriendRequestInput {
    senderId: String!
    receiverId: String!
    type: REQUEST_TYPE
  }

  # Friend_request Types
  type FriendRequestPayload {
    id: String!
    senderId: String!
    receiverId: String!
    isAccepted: Boolean
    requestedAt: DateTime
  }

  type FriendPayload {
    response: String
  }

  # Friendship Input

  # Friendship Types
  type FriendshipPayload {
    id: String!
    followers: User
    followings: User
    follower: String
    following: String
    createdAt: DateTime
  }

  type FriendshipCount {
    count: Int!
  }

  # Message Input

  # Message Types
  type MessagePayload {
    id: String!
    content: String
    chatRoomId: String
    editedAt: DateTime
    createdAt: DateTime
  }

  # ChatRoom Input

  # ChatRoom Types
  type ChatRoomPayload {
    id: String
    name: String
    isGroup: Boolean
    directkey: String
    lastMessageAt: DateTime
  }

  # Participant Input

  # Participant Types
  type ParticipantPayload {
    id: String
    chatRoomId: String
    role: PARTICIPANT_ROLE
    lastReadMsgId: String
    joinedAt: DateTime
    leftAt: DateTime
    lastReadAt: DateTime
  }

  # Subscription type
  type LiveEvent {
    action: String!
    createdAt: String!
    data: EventPayload!
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

    # Friend_request Query
    getFriendRequestsListOfUser: [FriendRequestPayload]

    searchFriendRequestByName(name: String!): [FriendRequestPayload]

    # Friendship Query
    getListOfFollowers: [FriendshipPayload]

    getListOfFollowings: [FriendshipPayload]

    getFollowersCount: FriendshipCount

    getFollowingsCount: FriendshipCount

    # Message Query
    retriveAllMessagesOfChatSpace(chatRoomId: String!): [MessagePayload]

    # ChatRoom Query

    # Participant Query
    retriveAllChatRoomsOfUser: [ParticipantPayload]

    searchUserRoom(name: String!): [ParticipantPayload]
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

    # Friend_request Mutation
    sendFriendRequest(input: FriendRequestInput): FriendRequestPayload

    resolveFriendRequest(requestId: String, response: Boolean): FriendPayload

    # Message Mutation
    sendMessage(content: String!, chatRoomId: String!): MessagePayload

    editMessage(
      id: String!
      content: String!
      chatRoomId: String!
    ): MessagePayload

    # ChatRoom Mutation
    createChatSpace(receiverId: String!): ChatRoomPayload

    # Participant Mutation

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

  type Subscription {
    onEvent: LiveEvent!
  }
`;
