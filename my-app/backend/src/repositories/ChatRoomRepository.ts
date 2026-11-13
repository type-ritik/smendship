import { PrismaClient } from "@prisma/client";
import { IChatRoomRepository } from "./IChatRoomRepository";
import {
  ChatRoomResponseDTO,
  CreateChatRoomRequestDTO,
} from "../models/ChatRoom";

export class ChatRoomRepository implements IChatRoomRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    request: CreateChatRoomRequestDTO,
  ): Promise<ChatRoomResponseDTO> {
    try {
      return await this.prisma.chatRoom.upsert({
        where: {
          directKey: request.data.directKey,
        },
        update: {},
        create: {
          isGroup: false,
          directKey: request.data.directKey,
          participants: {
            create: [
              { userId: request.senderId, role: "creator" },
              { userId: request.receiverId },
            ],
          },
        },
      });
    } catch (error) {
      console.log("ChatRoom database error");
      throw new Error("❌ Database error");
    }
  }

  findById(id: string): Promise<ChatRoomResponseDTO | null> {
    try {
      return this.prisma.chatRoom.findUnique({
        where: { id },
      });
    } catch (error) {
      console.log("ChatRoom database error");
      throw new Error("❌ Database error");
    }
  }

  findByDirectKey(directKey: string): Promise<ChatRoomResponseDTO | null> {
    try {
      return this.prisma.chatRoom.findUnique({
        where: { directKey },
      });
    } catch (error) {
      console.log("ChatRoom database error");
      throw new Error("❌ Database error");
    }
  }
}
