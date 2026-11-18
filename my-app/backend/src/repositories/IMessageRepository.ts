import {
  CreateMessageDTO,
  EditedMessageDTO,
  MessageResponseDTO,
  MessageUserResponseDTO,
} from "../models/Message";

export interface IMessageRepository {
  create(data: CreateMessageDTO): Promise<MessageUserResponseDTO>;
  update(data: EditedMessageDTO): Promise<MessageUserResponseDTO>;
  findById(id: string): Promise<MessageResponseDTO | null>;
  findAllMessageByChatRoomId(
    chatRoomId: string,
  ): Promise<MessageUserResponseDTO[]>;
}
