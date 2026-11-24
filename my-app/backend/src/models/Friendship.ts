import { UserResponseDTO } from "./User";

export interface IFriendship {
  id: string;
  follower: string;
  followers: UserResponseDTO;
  following: string;
  followings: UserResponseDTO;
  createdAt: Date;
}

// Friendship Request DTO
export type CreateFriendshipDTO = Omit<
  IFriendship,
  "id" | "followers" | "followings" | "createdAt"
>;

// Friendship Response DTO
export type FriendshipResponseDTO = Omit<IFriendship, "follower" | "following">;
