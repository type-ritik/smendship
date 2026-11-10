import { prisma } from "./prismaConfig";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { PasswordEncoder } from "./PasswordEncoder";
import { PostRepository } from "../repositories/PostRepository";
import { PostService } from "../services/PostService";

// 1. Instantiated exactly ONCE when the application starts up
const userRepository = new UserRepository(prisma);
const postRepository = new PostRepository(prisma);
const passwordEncoder = new PasswordEncoder();

const userService = new UserService(userRepository, passwordEncoder);
const postService = new PostService(postRepository, userRepository);

export const appServices = {
  user: userService,
  post: postService,
};
