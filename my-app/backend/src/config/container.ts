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

// Services
// User Service
const userService = new UserService(userRepository, passwordEncoder);

// Post Service
const postService = new PostService(postRepository, userRepository);

// Friend Request Service
const friendRequestService = new FriendRequestServices(
  friendRequestRepository,
  friendshipRepository,
);

// Friendship Service
const friendshipService = new FriendshipServices(friendshipRepository);

// Message Service
const messageService = new MessageService(messageRepository);

// Participant Service
const participantService = new ParticipantService(participantRepository);

// ChatRoom Service
const chatRoomService = new ChatRoomService(chatRoomRepository, userRepository);

export const appServices = {
  user: userService,
  post: postService,
  friendRequest: friendRequestService,
  friendship: friendshipService,
  message: messageService,
  participant: participantService,
  chatRoom: chatRoomService,
};
