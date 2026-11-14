import { MessageResponseDTO } from "../models/Message";
import { IMessageRepository } from "../repositories/IMessageRepository";
import { IParticipantRepository } from "../repositories/IParticipantRepository";
import { SubscriptionService } from "./SubscriptionService";

export class MessageService {
  constructor(
    private messageRepository: IMessageRepository,
    private subscriptionService: SubscriptionService,
    private participantRepository: IParticipantRepository,
  ) {}

  public async sendMessage(
    content: string,
    userId: string,
    chatRoomId: string,
  ): Promise<MessageResponseDTO> {
    const msgCreated = await this.messageRepository.create({
      content,
      senderId: userId,
      chatRoomId,
    });

    const users =
      await this.participantRepository.findAllParticipantByChatRoomId(
        msgCreated.chatRoomId,
      );

    const receiver = users.find((user) => user.userId !== userId);

    await this.subscriptionService.message(receiver.userId, msgCreated);

    return msgCreated;
  }

  public async editMessage(
    id: string,
    content: string,
    userId: string,
    chatRoomId: string,
  ): Promise<MessageResponseDTO> {
    const msgEdited = await this.messageRepository.update({
      id,
      content,
      chatRoomId,
      senderId: userId,
    });

    const users =
      await this.participantRepository.findAllParticipantByChatRoomId(
        msgEdited.chatRoomId,
      );

    const receiver = users.find((user) => user.userId !== userId);

    await this.subscriptionService.message(receiver.userId, msgEdited);

    return msgEdited;
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
