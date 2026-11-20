// File: backend/src/schema/typeDefs.js
import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

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
    name: String
    email: String
    # Other profile properties
  }

  # User Types
  type User {
    id: String
    name: String
    email: String
    createdAt: String
    status: String
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
    imageId: String
  }

  input EditPostInput {
    id: String
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
    createdAt: DateTime
    author: User
    postImages: [PostImage]
  }

  type InfinitePostPayload {
    posts: [Post]
    nextCursor: String
  }

  # Friend_request Input

  # Friend_request Types
  type FriendRequestPayload {
    id: String!
    senderId: String
    receiverId: String
    isAccepted: Boolean
    requestedAt: DateTime
    sender: User
    receiver: User
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

  # Message Input

  # Message Types
  type MessagePayload {
    id: String!
    content: String
    chatRoomId: String
    editedAt: DateTime
    createdAt: DateTime
    sender: User
  }

  # ChatRoom Input

  # ChatRoom Types
  type ChatRoomPayload {
    id: String
    name: String
    isGroup: Boolean
    directKey: String
    lastMessageAt: String
    messages: [MessagePayload]
    participants: [ParticipantPayload]
  }

  # Participant Input

  # Participant Types
  type ParticipantPayload {
    id: String
    chatRoomId: String
    userId: String
    role: PARTICIPANT_ROLE
    lastReadMsgId: String
    joinedAt: String
    leftAt: String
    user: User
    lastReadAt: DateTime
  }

  # Subscription Types
  type LiveEvent {
    action: String!
    createdAt: String!
    data: EventPayload!
  }

  # Notification Input

  # Notification Types
  type NotificationPayload {
    id: String!
    fromUserId: String!
    isRead: Boolean
    postId: String
    toUserId: String!
    type: String!
    user1: User
    user2: User
    notifiedAt: String!
    post: Post
  }

  # Comment Inputs

  # Comment Types
  type CommentPayload {
    id: String!
    comment: String!
    authorId: String!
    postId: String!
    author: User
    post: Post
    createdAt: String!
  }

  # LikePost Input

  # LikePost Types
  type LikePostPayload {
    id: String!
    userId: String!
    postId: String!
    isLiked: Boolean!
    user: User
    post: Post
    createdAt: String!
  }

  # Image Input

  # Image Types
  type ImagePayload {
    id: String!
    url: String!
    userId: String
    user: User
  }

  # PostImage Input

  # PostImage Type
  type PostImage {
    id: String!
    postId: String
    postedAt: DateTime
    imageId: String
    image: ImagePayload
  }

  # Global Input

  # Global Types
  type GlobalPayload {
    response: String
  }

  type GlobalCount {
    count: Int!
  }

  type Query {
    # User Query

    requestForPasswordReset: UserOTPPayload

    getAllUserData: User

    searchUser(name: String!): [User]

    # Post Query
    getPostsByUserId(userId: String!): [Post]

    getPostByPostId(postId: String!): Post

    searchPost(text: String!): Post

    fetchMePosts(lastPostId: String): InfinitePostPayload

    # Friend_request Query
    getFriendRequestsListOfUser: [FriendRequestPayload]

    getSentFriendRequestListOfUser: [FriendRequestPayload]

    searchFriendRequestByName(name: String!): [FriendRequestPayload]

    # Friendship Query
    getListOfFollowers: [FriendshipPayload]

    getListOfFollowings: [FriendshipPayload]

    getFollowersCount: GlobalCount

    getFollowingsCount: GlobalCount

    # Message Query
    retriveAllMessagesOfChatSpace(chatRoomId: String!): [MessagePayload]

    # ChatRoom Query
    retriveChatFriends: [ChatRoomPayload]

    # Participant Query
    retriveAllChatRoomsOfUser: [ParticipantPayload] # Duplicate of retriveChatFriends
    retriveUserProfileOfRoom(chatRoomId: String!): ParticipantPayload

    searchUserRoom(name: String!): [ParticipantPayload]

    # Notification Query
    searchNotification(type: String!): [NotificationPayload]

    retriveUserNotifications: [NotificationPayload]

    # Comment Query
    retriveCommentsOfPost(postId: String!): [CommentPayload]

    retriveCommentOf(id: String!): CommentPayload

    # LikePost Query
    retriveLikePostsByUser: [LikePostPayload]

    retriveLikesOfPost(postId: String!): [LikePostPayload]

    retriveLikesCountOnPost(postId: String!): GlobalCount

    # Image Query
    retriveImageById(imageId: String!): ImagePayload

    retriveImageListOfUser: [ImagePayload]
  }

  type Mutation {
    # User Mutation
    loginUpUser(email: String!, password: String!): UserAuthPayload

    signUpUser(input: SignupInput): UserOTPPayload

    githubAuth(gitToken: String!): UserAuthPayload

    googleAuth(googleToken: String!): UserAuthPayload

    codeVerification(email: String!, OTP: String!): UserAuthPayload

    resetPassword(userId: String, password: String!): UserOTPPayload

    updateProfile(input: ProfileInput): ProfilePayload

    # Post Mutation
    createPost(input: PostInput!): Post

    editPost(input: EditPostInput!): Post

    # Friend_request Mutation
    sendFriendRequest(receiverId: String!): GlobalPayload

    resolveFriendRequest(requestId: String, response: Boolean!): GlobalPayload

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

    # Notification Mutation
    deleteNotification(id: String!): GlobalPayload

    # Comment Mutation
    createComment(comment: String!, postId: String!): CommentPayload

    editComment(id: String!, comment: String!): CommentPayload

    deleteComment(id: String!): GlobalPayload

    # LikePost Mutation
    likePost(postId: String!, isLiked: Boolean): LikePostPayload

    unLikePost(id: String!, isLiked: Boolean!): LikePostPayload

    removeLikePost(id: String!): GlobalPayload

    # Image Mutation
    uploadImage(image: String!): ImagePayload
  }

  type Subscription {
    onEvent: LiveEvent!
  }
`;
