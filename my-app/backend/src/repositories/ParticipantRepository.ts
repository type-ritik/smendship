import { PrismaClient } from "@prisma/client";
import { IParticipantRepository } from "./IParticipantRepository";
import {
  CreateParticipantDTO,
  ParticipantResponseDTO,
} from "../models/Participants";

export class ParticipantRepository implements IParticipantRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateParticipantDTO): Promise<ParticipantResponseDTO> {
    try {
      return this.prisma.participant.create({
        data: {
          userId: data.userId,
          chatRoomId: data.chatRoomId,
          role: data.role,
        },
      });
    } catch (error) {
      console.log("Participant database error");
      throw new Error("❌ Database error");
    }
  }

  async findAllParticipantRoomByUserId(
    userId: string,
  ): Promise<ParticipantResponseDTO[]> {
    try {
      return this.prisma.participant.findMany({
        where: { userId },
      });
    } catch (error) {
      console.log("Participant database error");
      throw new Error("❌ Database error");
    }
  }

  async findParticipantByName(name: string): Promise<ParticipantResponseDTO[]> {
    try {
      return this.prisma.participant.findMany({
        where: {
          user: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        },
      });
    } catch (error) {
      console.log("Participant database error");
      throw new Error("❌ Database Error");
    }
  }
}
