import { PrismaClient } from "@prisma/client";
import { IMessageRepository } from "./IMessageRepository";
import {
  CreateMessageDTO,
  EditedMessageDTO,
  MessageResponseDTO,
} from "../models/Message";

export class MessageRepository implements IMessageRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateMessageDTO): Promise<MessageResponseDTO> {
    try {
    const payload = await this.prisma.$transaction([
        this.prisma.message.create({
          data: {
            content: data.content,
            senderId: data.senderId,
            chatRoomId: data.chatRoomId,
          },
          select: {
            id: true,
            content: true,
            senderId: true,
            chatRoomId: true,
            createdAt: true,
            editedAt: true,
          },
        }),
        this.prisma.chatRoom.update({
          where: { id: data.chatRoomId },
          data: { lastMessageAt: new Date() },
        }),
      ])

      return payload[0]
    } catch (error) {
      console.log("Message database error");
      throw new Error("❌ Database error");
    }
  }

  async update(data: EditedMessageDTO): Promise<MessageResponseDTO> {
    try {
      return await this.prisma.$transaction([
        this.prisma.message.update({
          where: { id: data.id },
          data: {
            content: data.content,
            editedAt: new Date(),
          },
        }),
        this.prisma.chatRoom.update({
          where: { id: data.chatRoomId },
          data: { lastMessageAt: new Date() },
        }),
      ])[0];
    } catch (error) {
      console.log("Message database error");
      throw new Error("❌ Database error");
    }
  }

  async findById(id: string): Promise<MessageResponseDTO | null> {
    try {
      return await this.prisma.message.findUnique({
        where: { id },
      });
    } catch (error) {
      console.log("Message database error");
      throw new Error("❌ Database error");
    }
  }

  findAllMessageByChatRoomId(
    chatRoomId: string,
    userId: string,
  ): Promise<MessageResponseDTO[]> {
    try {
      return this.prisma.message.findMany({
        where: { chatRoomId, senderId: userId },
      });
    } catch (error) {
      console.log("Message database error");
      throw new Error("❌ Database error");
    }
  }
}
