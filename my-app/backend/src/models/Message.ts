import { ChatRoom } from "@prisma/client";
import { UserResponseDTO } from "./User";

export interface IMessage {
  id: string;
  content: string;
  senderId: string;
  chatRoomId: string;
  createdAt: Date;
  editedAt: Date;
  deletedAt: Date;
  chatRoom: ChatRoom;
  sender: UserResponseDTO;
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

export type MessageUserResponseDTO = Omit<IMessage, "deletedAT" | "chatRoom">;
