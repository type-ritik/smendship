import { Request, User } from "@prisma/client";

export interface IFriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  isAccepted: boolean;
  type: Request;
  receiver: User;
  sender: User;
  requestedAt: Date;
  acceptedAt: Date;
}

// Request DTO
export type CreateRequestDTO = Omit<
  IFriendRequest,
  "requestedAt" | "acceptedAt" | "receiver" | "sender" | "isAccepted" | "id"
>;

// Response DTO
export type FriendResponseDTO = Omit<
  IFriendRequest,
  "acceptedAt" | "sender" | "receiver" | "type"
>;
