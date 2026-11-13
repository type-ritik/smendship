import { ChatRoomResponseDTO } from "../models/ChatRoom";
import { IChatRoomRepository } from "../repositories/IChatRoomRepository";
import { IUserRepository } from "../repositories/IUserRepository";

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

    return this.chatRoomRepository.create({
      receiverId,
      senderId: userId,
      data: { directKey, isGroup: false, name: "" },
    });
  }

  private generateDirectKey(userId: string, receiverId: string): string {
    return [userId, receiverId].sort().join(":");
  }
}
