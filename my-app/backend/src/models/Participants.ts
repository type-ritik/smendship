import { ChatRoom, participant_role, User } from "@prisma/client";

export interface IParticipant {
  id: string;
  userId: string;
  chatRoomId: string;
  role: participant_role;
  joinedAt: Date;
  leftAt: Date;
  lastReadAt: Date;
  lastReadMsgId: string;
  chatRoom: ChatRoom;
  user: User;
}

// Participant Request DTO
export type CreateParticipantDTO = Omit<
  IParticipant,
  | "id"
  | "joinedAt"
  | "leftAt"
  | "lastReadAt"
  | "lastReadMsgId"
  | "chatRoom"
  | "user"
>;

// Participant Response DTO
export type ParticipantResponseDTO = Omit<IParticipant, "chatRoom" | "user">;
