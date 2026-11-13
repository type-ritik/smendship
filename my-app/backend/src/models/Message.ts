import { ChatRoom, User } from "@prisma/client";

export interface IMessage {
  id: string;
  content: string;
  senderId: string;
  chatRoomId: string;
  createdAt: Date;
  editedAt: Date;
  deletedAt: Date;
  chatRoom: ChatRoom;
  sender: User;
}

// Message Request DTO
export type CreateMessageDTO = Omit<
  IMessage,
  "id" | "sender" | "chatRoom" | "deletedAt" | "editedAt" | "createdAt"
>;

export type EditedMessageDTO = Omit<
  IMessage,
  "sender" | "chatRoom" | "deletedAt" | "createdAt" | "editedAt"
>;

// Message Response DTO
export type MessageResponseDTO = Omit<
  IMessage,
  "deletedAt" | "chatRoom" | "sender"
>;
