import { prisma } from "./prismaConfig";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { PasswordEncoder } from "./PasswordEncoder";
import { PostRepository } from "../repositories/PostRepository";
import { PostService } from "../services/PostService";
import { FriendRequestRepository } from "../repositories/FriendRequestRepository";
import { FriendRequestServices } from "../services/FriendRequestServices";
import { FriendshipRepository } from "../repositories/FriendshipRespository";
import { FriendshipServices } from "../services/FriendshipServices";
import { MessageRepository } from "../repositories/MessageRepository";
import { ParticipantRepository } from "../repositories/ParticipantRepository";
import { ChatRoomRepository } from "../repositories/ChatRoomRepository";
import { MessageService } from "../services/MessageServices";
import { ParticipantService } from "../services/ParticipantServices";
import { ChatRoomService } from "../services/ChatRoomServices";
import { SubscriptionService } from "../services/SubscriptionService";
import { pubsub } from "./pubsub";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { NotificationService } from "../services/NotificationServices";
import { CommentRepository } from "../repositories/CommentRepository";
import { CommentService } from "../services/CommentServices";
import { LikePostRepository } from "../repositories/LikePostRepository";
import { LikePostService } from "../services/LikePostServices";
import { ImageRepository } from "../repositories/ImageRepository";
import { ImageServices } from "../services/ImageServices";

// Repository & Configs
// User Repo
const userRepository = new UserRepository(prisma);

// Post Repo
const postRepository = new PostRepository(prisma);

// FriendRequest Repo
const friendRequestRepository = new FriendRequestRepository(prisma);

// Friendship Repo
const friendshipRepository = new FriendshipRepository(prisma);

// Message Repo
const messageRepository = new MessageRepository(prisma);

// Participant Repo
const participantRepository = new ParticipantRepository(prisma);

// ChatRoom Repo
const chatRoomRepository = new ChatRoomRepository(prisma);

// Password Encoder config
const passwordEncoder = new PasswordEncoder();

// Notification Repo
const notificationRepository = new NotificationRepository(prisma);

// Comment Repo
const commentRepository = new CommentRepository(prisma);

// LikePost Repo
const likePostRepository = new LikePostRepository(prisma);

// Image Repo
const imageRepository = new ImageRepository(prisma);

// Services

// Subscription Service
const subscriptionService = new SubscriptionService(pubsub);

// User Service
const userService = new UserService(userRepository, passwordEncoder);

// Post Service
const postService = new PostService(postRepository, userRepository);

// Friend Request Service
const friendRequestService = new FriendRequestServices(
  friendRequestRepository,
  subscriptionService,
);

// Friendship Service
const friendshipService = new FriendshipServices(friendshipRepository);

// Message Service
const messageService = new MessageService(
  messageRepository,
  subscriptionService,
  participantRepository,
);

// Participant Service
const participantService = new ParticipantService(participantRepository);

// ChatRoom Service
const chatRoomService = new ChatRoomService(chatRoomRepository, userRepository);

// Notification Service
const notificationService = new NotificationService(
  notificationRepository,
  subscriptionService,
);

// Comment Service
const commentService = new CommentService(commentRepository);

// LikePost Service
const likePostService = new LikePostService(likePostRepository);

// Image Service
const imageService = new ImageServices(imageRepository);

export const appServices = {
  user: userService,
  post: postService,
  friendRequest: friendRequestService,
  friendship: friendshipService,
  message: messageService,
  participant: participantService,
  chatRoom: chatRoomService,
  subscription: subscriptionService,
  notification: notificationService,
  comment: commentService,
  likePost: likePostService,
  image: imageService,
};
