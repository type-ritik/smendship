import { Category } from "@prisma/client";
import { IUser, UserResponseDTO } from "./User";
import { IPostImages } from "./PostImages";

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  likeCount: number;
  category: Category;
  is_revoked: boolean;
  author: UserResponseDTO;
  imageId: string;
  postImages: IPostImages[];
}

// RequestDTO
export type CreatePostRequestDTO = Omit<
  IPost,
  "likeCount" | "author" | "createdAt" | "is_revoked" | "id" | "postImages"
>;

export type EditPostRequestDTO = Omit<
  IPost,
  | "likeCount"
  | "author"
  | "createdAt"
  | "is_revoked"
  | "author"
  | "imageId"
  | "postImages"
>;

// ResponseDTO
export type PostResponseDTO = Omit<
  IPost,
  "is_revoked" | "authorId" | "imageId" | "postImages"
>;

export type PostProfileResponseDTO = Omit<
  IPost,
  "is_revoked" | "authorId" | "imageId"
>;
