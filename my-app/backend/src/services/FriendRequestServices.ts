import { CreateRequestDTO, FriendResponseDTO } from "../models/FriendRequest";
import { IFriendRequestRepository } from "../repositories/IFriendRequestRepository";
import { IFriendshipRepository } from "../repositories/IFriendshipRepository";

export class FriendRequestServices {
  constructor(
    private friendRequestRepository: IFriendRequestRepository,
    private friendshipRepository: IFriendshipRepository,
  ) {}

  public async sendFriendRequest(
    request: CreateRequestDTO,
  ): Promise<FriendResponseDTO> {
    if (!request.receiverId) throw new Error("Invalid receiver");

    if (!request.senderId) throw new Error("Invalid sender");

    const payload =
      await this.friendRequestRepository.createFriendRequest(request);

    return payload;
  }

  public async interpretFriendRequestResponse(
    id: string,
    response: boolean,
  ): Promise<{ response: string }> {
    if (!id) throw new Error("Invalid request");

    const payload =
      await this.friendRequestRepository.updateFriendRequestResponseById(
        id,
        response,
      );

    if (payload.response) {
      const friendRequest = await this.friendshipRepository.createFriendship({
        follower: payload.user.senderId,
        following: payload.user.receiverId,
      });

      return friendRequest;
    }

    return {
      response: "Friend request rejected",
    };
  }

  public async fetchFriendRequestsById(
    userId: string,
  ): Promise<FriendResponseDTO[] | null> {
    const payload =
      await this.friendRequestRepository.getFriendRequestsById(userId);

    return payload;
  }

  public async fetchFriendRequestByName(
    name: string,
  ): Promise<FriendResponseDTO[] | null> {
    const payload =
      await this.friendRequestRepository.getFriendRequestByName(name);

    return payload;
  }
}
