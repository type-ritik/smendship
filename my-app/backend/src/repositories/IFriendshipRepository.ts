import {
  CreateFriendshipDTO,
  FriendshipResponseDTO,
} from "../models/Friendship";

export interface IFriendshipRepository {
  createFriendship(data: CreateFriendshipDTO): Promise<{ response: string }>;
  getFollowersList(userId: string): Promise<FriendshipResponseDTO[] | null>;
  getFollowingsList(userId: string): Promise<FriendshipResponseDTO[] | null>;
  getCountOfFollowers(userId: string): Promise<{ count: number }>;
  getCountOfFollowings(userId: string): Promise<{ count: number }>;
}
