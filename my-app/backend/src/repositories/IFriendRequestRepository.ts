import { CreateRequestDTO, FriendResponseDTO } from "../models/FriendRequest";

export interface IFriendRequestRepository {
  createFriendRequest(request: CreateRequestDTO): Promise<FriendResponseDTO>;
  getFriendRequestsById(userId: string): Promise<FriendResponseDTO[] | null>;
  getFriendRequestByName(name: string): Promise<FriendResponseDTO[] | null>;
  updateFriendRequestResponseById(
    id: string,
    response: boolean,
  ): Promise<{ response: boolean, user: FriendResponseDTO }>;
}
