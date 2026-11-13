import { MessageResponseDTO } from "../models/Message";
import { IMessageRepository } from "../repositories/IMessageRepository";

export class MessageService {
  constructor(private messageRepository: IMessageRepository) {}

  public async sendMessage(
    content: string,
    userId: string,
    chatRoomId: string,
  ): Promise<MessageResponseDTO> {
    return await this.messageRepository.create({
      content,
      senderId: userId,
      chatRoomId,
    });
  }

  public async editMessage(
    id: string,
    content: string,
    userId: string,
    chatRoomId: string,
  ): Promise<MessageResponseDTO> {
    return await this.messageRepository.update({
      id,
      content,
      chatRoomId,
      senderId: userId,
    });
  }

  public async fetchAllMessagesOfChatRoom(
    chatRoomId: string,
    userId: string,
  ): Promise<MessageResponseDTO[]> {
    return await this.messageRepository.findAllMessageByChatRoomId(
      chatRoomId,
      userId,
    );
  }
}
