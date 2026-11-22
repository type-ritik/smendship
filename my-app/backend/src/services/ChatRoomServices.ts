import {
  ChatRoomParticipantResponseDTO,
  ChatRoomResponseDTO,
} from "../models/ChatRoom";
import { IChatRoomRepository } from "../repositories/IChatRoomRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { presenceService } from "./presenceService";

export class ChatRoomService {
  constructor(
    private chatRoomRepository: IChatRoomRepository,
    private userRepository: IUserRepository,
  ) {}

  public async createChatRoom(
    userId: string,
    receiverId: string,
  ): Promise<ChatRoomResponseDTO> {
    const receiver = await this.userRepository.findById(receiverId);

    if (!receiver) throw new Error("Unauthorized receiver");

    const directKey = this.generateDirectKey(userId, receiverId);

    const payload = await this.chatRoomRepository.create({
      receiverId,
      senderId: userId,
      data: { directKey, isGroup: false, name: "" },
    });

    await presenceService.setWatcher(userId, receiverId);
    await presenceService.setWatcher(receiverId, userId);

    return payload;
  }

  public async fetchUserChatRoomParticipants(
    userId: string,
  ): Promise<ChatRoomParticipantResponseDTO[]> {
    const participants =
      await this.chatRoomRepository.findAllChatRoomParticipantAreNotUserId(
        userId,
      );

    const userIds = participants.flatMap((room) =>
      room.participants.map((participant) => participant.userId),
    );
    const onlineStatuses = await presenceService.getOnlineStatuses(userIds);

    return participants.map((room) => ({
      ...room,
      participants: room.participants.map((participant) => ({
        ...participant,
        user: {
          ...participant.user,
          status: onlineStatuses[participant.userId] ? "online" : "offline",
        },
      })),
    }));
  }

  private generateDirectKey(userId: string, receiverId: string): string {
    return [userId, receiverId].sort().join(":");
  }
}
