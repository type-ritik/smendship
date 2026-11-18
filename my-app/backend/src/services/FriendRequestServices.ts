import {
  CreateRequestDTO,
  FriendRequestSenderDTO,
  FriendRequestUserDTO,
  FriendResponseDTO,
} from "../models/FriendRequest";
import { IFriendRequestRepository } from "../repositories/IFriendRequestRepository";
import { SubscriptionService } from "./SubscriptionService";

export class FriendRequestServices {
  constructor(
    private friendRequestRepository: IFriendRequestRepository,
    private subscriptionService: SubscriptionService,
  ) {}

  public async sendFriendRequest(
    request: CreateRequestDTO,
  ): Promise<{ response: string }> {
    if (!request.receiverId) throw new Error("Invalid receiver");

    if (!request.senderId) throw new Error("Invalid sender");

    const payload =
      await this.friendRequestRepository.createFriendRequest(request);

    await this.subscriptionService.request(request.receiverId, payload);

    return { response: "Friend request sent successfully" };
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

    await this.subscriptionService.request(payload.receiverId, payload);

    return {
      response: payload.isAccepted
        ? "Friendship is created successfully."
        : "Friendship isn't created.",
    };
  }

  public async fetchFriendRequestsById(
    userId: string,
  ): Promise<FriendRequestUserDTO[] | null> {
    const payload =
      await this.friendRequestRepository.getFriendRequestsById(userId);

    return payload;
  }

  public async fetchSentFriendRequestById(
    userId: string,
  ): Promise<FriendRequestSenderDTO[] | null> {
    const payload =
      await this.friendRequestRepository.getFriendRequestsSentByUser(userId);
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
