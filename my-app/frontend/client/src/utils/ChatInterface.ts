// Backend ParticipantPayload (Query.retriveAllChatRoomsOfUser).
// Old shape had `chatroomId` + a single `participants.user` that the backend never returned.
export interface RoomInterface {
  id: string;
  lastReadMsgId?: string | null;
  lastReadAt?: string | null;
  messages: Message[] | null;
  participants: RoomMember[] | null;
  joinedAt?: string | null;
}

// No backend query provides this yet (getRoomMemberProfile was removed).
// Fields are optional until the schema exposes them.
export interface RoomMember {
  id: string;
  role: "member" | "creator" | "admin";
  user: {
    id: string;
    name: string;
    profile_image?: string | null;
    status?: string;
  };
}

// Backend MessagePayload. `sender` is optional: add `sender: User` to
// MessagePayload in typeDefs if the chat UI needs names.
export interface Message {
  id: string;
  chatRoomId: string;
  content: string;
  createdAt?: string;
  editedAt?: string | null;
  senderId: string | null;
  sender: {
    id: string;
    name: string;
  };
  // sender?: {
  //   id: string;
  //   name: string;
  // } | null;
}
