import { Request } from "@prisma/client";
import { UserResponseDTO } from "./User";

export interface IFriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  isAccepted: boolean;
  type: Request;
  receiver: UserResponseDTO;
  sender: UserResponseDTO;
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

export type FriendRequestUserDTO = Omit<
  IFriendRequest,
  "acceptedAt" | "type" | "receiver"
>;

export type FriendRequestSenderDTO = Omit<
  IFriendRequest,
  "acceptedAt" | "sender" | "type"
>;
