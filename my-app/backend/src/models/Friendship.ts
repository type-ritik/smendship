import { User } from "@prisma/client";

export interface IFriendship {
  id: string;
  follower: string;
  followers: User;
  following: string;
  followings: User;
  createdAt: Date;
}

// Friendship Request DTO
export type CreateFriendshipDTO = Omit<
  IFriendship,
  "id" | "followers" | "followings" | "createdAt"
>;

// Friendship Response DTO
export type FriendshipResponseDTO = Omit<IFriendship, "follower" | "following">;
