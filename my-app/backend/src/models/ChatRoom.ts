import { Message, Participant } from "@prisma/client";

export interface IChatRoom {
  id: string;
  name: string;
  isGroup: boolean;
  directKey: string;
  lastMessageAt: Date;
  messages: Message[] | null;
  participants: Participant[] | null;
}

// ChatRoom Request DTO
export type CreateChatRoomDTO = Omit<
  IChatRoom,
  "lastMessageAt" | "messages" | "participants" | "id"
>;

export type CreateChatRoomRequestDTO = {
  data: CreateChatRoomDTO;
  senderId: string;
  receiverId: string;
};

// ChatRoom Response DTO
export type ChatRoomResponseDTO = Omit<IChatRoom, "messages" | "participants">;
