import {
  CreateRequestDTO,
  FriendRequestSenderDTO,
  FriendRequestUserDTO,
  FriendResponseDTO,
} from "../models/FriendRequest";

export interface IFriendRequestRepository {
  createFriendRequest(request: CreateRequestDTO): Promise<FriendResponseDTO>;
  getFriendRequestsById(userId: string): Promise<FriendRequestUserDTO[] | null>;
  getFriendRequestsSentByUser(
    userId: string,
  ): Promise<FriendRequestSenderDTO[] | null>;
  getFriendRequestByName(name: string): Promise<FriendResponseDTO[] | null>;
  updateFriendRequestResponseById(
    id: string,
    response: boolean,
  ): Promise<FriendResponseDTO>;
}
