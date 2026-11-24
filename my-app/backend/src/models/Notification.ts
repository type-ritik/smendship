import { Post } from "@prisma/client";
import { UserResponseDTO } from "./User";

export interface INotification {
  id: string;
  fromUserId: string;
  isRead: boolean;
  postId: string;
  toUserId: string;
  type: string;
  user1: UserResponseDTO;
  user2: UserResponseDTO;
  notifiedAt: Date;
  post: Post;
}

// Notification Request DTO
export type CreateNotificationDTO = Omit<
  INotification,
  "id" | "isRead" | "user1" | "user2" | "notifiedAt" | "postId" | "post"
>;

export type CreatePostNotificationDTO = Omit<
  INotification,
  "id" | "isRead" | "user1" | "user2" | "notifiedAt" | "post"
>;

// Notification Response DTO
export type NotificationResponseDTO = Omit<
  INotification,
  "postId" | "post" | "user1" | "user2"
>;

export type NotificationPostResponseDTO = Omit<
  INotification,
  "user1" | "user2" | "post"
>;
