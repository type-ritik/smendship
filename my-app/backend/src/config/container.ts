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

// 1. Instantiated exactly ONCE when the application starts up
const userRepository = new UserRepository(prisma);
const postRepository = new PostRepository(prisma);
const friendRequestRepository = new FriendRequestRepository(prisma);
const friendshipRepository = new FriendshipRepository(prisma);
const passwordEncoder = new PasswordEncoder();

const userService = new UserService(userRepository, passwordEncoder);
const postService = new PostService(postRepository, userRepository);
const friendRequestService = new FriendRequestServices(
  friendRequestRepository,
  friendshipRepository,
);
const friendshipService = new FriendshipServices(friendshipRepository);

export const appServices = {
  user: userService,
  post: postService,
  friendRequest: friendRequestService,
  friendship: friendshipService,
};
