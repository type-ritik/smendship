import { PrismaClient } from "@prisma/client";
import { IMessageRepository } from "./IMessageRepository";
import {
  CreateMessageDTO,
  EditedMessageDTO,
  MessageResponseDTO,
  MessageUserResponseDTO,
} from "../models/Message";

export class MessageRepository implements IMessageRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateMessageDTO): Promise<MessageUserResponseDTO> {
    try {
      const payload = await this.prisma.$transaction([
        this.prisma.message.create({
          data: {
            content: data.content,
            senderId: data.senderId,
            chatRoomId: data.chatRoomId,
          },
          include: {
            sender: true,
          },
        }),
        this.prisma.chatRoom.update({
          where: { id: data.chatRoomId },
          data: { lastMessageAt: new Date() },
        }),
      ]);

      return payload[0];
    } catch (error) {
      console.log("Message database error");
      throw new Error("❌ Database error");
    }
  }

  async update(data: EditedMessageDTO): Promise<MessageUserResponseDTO> {
    try {
      return await this.prisma.$transaction([
        this.prisma.message.update({
          where: { id: data.id },
          data: {
            content: data.content,
            editedAt: new Date(),
          },
          include: {
            sender: true,
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
  ): Promise<MessageUserResponseDTO[]> {
    try {
      return this.prisma.message.findMany({
        where: { chatRoomId },
        include: {
          sender: true,
        },
      });
    } catch (error) {
      console.log("Message database error");
      throw new Error("❌ Database error");
    }
  }
}
