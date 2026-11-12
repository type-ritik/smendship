import { FriendshipResponseDTO } from "../models/Friendship";
import { IFriendshipRepository } from "../repositories/IFriendshipRepository";

export class FriendshipServices {
  constructor(private friendshipRepository: IFriendshipRepository) {}

  public async fetchUserFollowers(
    userId: string,
  ): Promise<FriendshipResponseDTO[] | null> {
    const payload = await this.friendshipRepository.getFollowersList(userId);

    return payload;
  }

  public async fetchUserFollowings(
    userId: string,
  ): Promise<FriendshipResponseDTO[] | null> {
    const payload = await this.friendshipRepository.getFollowingsList(userId);

    return payload;
  }

  public async fetchFollowersCount(userId: string): Promise<{ count: number }> {
    const payload = await this.friendshipRepository.getCountOfFollowers(userId);

    return payload;
  }

  public async fetchFollowingsCount(
    userId: string,
  ): Promise<{ count: number }> {
    const payload =
      await this.friendshipRepository.getCountOfFollowings(userId);

    return payload;
  }
}
