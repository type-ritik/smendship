import { PrismaClient } from "@prisma/client";
import { IChatRoomRepository } from "./IChatRoomRepository";
import {
  ChatRoomParticipantResponseDTO,
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

  async findById(id: string): Promise<ChatRoomResponseDTO | null> {
    try {
      return await this.prisma.chatRoom.findUnique({
        where: { id },
      });
    } catch (error) {
      console.log("ChatRoom database error");
      throw new Error("❌ Database error");
    }
  }

  async findByDirectKey(
    directKey: string,
  ): Promise<ChatRoomResponseDTO | null> {
    try {
      return await this.prisma.chatRoom.findUnique({
        where: { directKey },
      });
    } catch (error) {
      console.log("ChatRoom database error");
      throw new Error("❌ Database error");
    }
  }

  async findAllChatRoomParticipantAreNotUserId(
    userId: string,
  ): Promise<ChatRoomParticipantResponseDTO[]> {
    try {
      const rooms = await this.prisma.chatRoom.findMany({
        where: {
          participants: {
            some: {
              userId,
            },
          },
        },

        select: {
          id: true,
          directKey: true,
          lastMessageAt: true,
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          participants: {
            where: {
              userId: {
                not: userId,
              },
            },
            include: {
              chatRoom: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                  profileImage: {
                    select: {
                      id: true,
                      url: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return rooms as unknown as ChatRoomParticipantResponseDTO[];
    } catch (error) {
      console.log("ChatRoom database error", error);
      throw new Error("❌ Database error");
    }
  }
}
