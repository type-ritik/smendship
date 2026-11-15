import { Post, User } from "@prisma/client";

export interface ILikePost {
  id: string;
  userId: string;
  postId: string;
  isLiked: boolean;
  createdAt: Date;
  user: User;
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
