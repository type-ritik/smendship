import { Post, User } from "@prisma/client";

export interface IComment {
  id: string;
  comment: string;
  authorId: string;
  postId: string;
  createdAt: Date;
  author: User;
  post: Post;
}

// Comment Request DTO
export type CreateCommentDTO = Omit<
  IComment,
  "id" | "createdAt" | "author" | "post"
>;

export type EditCommentDTO = Omit<
  IComment,
  "author" | "post" | "authorId" | "postId" | "createdAt"
>;

// Comment Response DTO
export type CommentResponseDTO = Omit<IComment, "author" | "post">;
