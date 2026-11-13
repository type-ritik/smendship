import {
  CreateMessageDTO,
  EditedMessageDTO,
  MessageResponseDTO,
} from "../models/Message";

export interface IMessageRepository {
  create(data: CreateMessageDTO): Promise<MessageResponseDTO>;
  update(data: EditedMessageDTO): Promise<MessageResponseDTO>;
  findById(id: string): Promise<MessageResponseDTO | null>;
  findAllMessageByChatRoomId(chatRoomId: string, userId: string): Promise<MessageResponseDTO[]>;
}
