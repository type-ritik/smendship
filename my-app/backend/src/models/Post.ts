import { Category } from "@prisma/client";
import { IUser } from "./User";

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  likeCount: number;
  category: Category;
  is_revoked: boolean;
  author: IUser;
}

// RequestDTO
export type CreatePostRequestDTO = Omit<
  IPost,
  "likeCount" | "author" | "createdAt" | "is_revoked" | "id"
>;

export type EditPostRequestDTO = Omit<
  IPost,
  "likeCount" | "author" | "createdAt" | "is_revoked" | "author"
>;

// ResponseDTO
export type PostResponseDTO = Omit<IPost, "is_revoked" | "author">;
