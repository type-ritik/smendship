export interface RoomInterface {
  chatroomId: string;
  participants: {
    user: {
      id: string;
      name: string;
      status: string;
    };
  };
}

export interface RoomMember {
  id: string;
  user: {
    id: string;
    name: string;
    profile_image: string | null;
    status: string;
  };
}
