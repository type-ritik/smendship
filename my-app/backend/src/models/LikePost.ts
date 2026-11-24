import { Post } from "@prisma/client";
import { UserResponseDTO } from "./User";

export interface ILikePost {
  id: string;
  userId: string;
  postId: string;
  isLiked: boolean;
  createdAt: Date;
  user: UserResponseDTO;
  post: Post;
}

// LikePost Request DTO
export type CreateLikePostDTO = Omit<
  ILikePost,
  "user" | "post" | "createdAt" | "id"
>;

export type EditLikePostDTO = Omit<
  ILikePost,
  "user" | "post" | "createdAt" | "userId" | "postId"
>;

// LikePost Response DTO
export type LikePostResponseDTO = Omit<ILikePost, "user" | "post">;
