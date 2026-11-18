import { PrismaClient } from "@prisma/client";
import {
  CreateRequestDTO,
  FriendRequestSenderDTO,
  FriendRequestUserDTO,
  FriendResponseDTO,
} from "../models/FriendRequest";
import { IFriendRequestRepository } from "./IFriendRequestRepository";

export class FriendRequestRepository implements IFriendRequestRepository {
  constructor(private prisma: PrismaClient) {}

  async createFriendRequest(
    request: CreateRequestDTO,
  ): Promise<FriendResponseDTO> {
    try {
      const friendRequest = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.friendRequest.findFirst({
          where: {
            OR: [
              { senderId: request.senderId, receiverId: request.receiverId },
              { senderId: request.receiverId, receiverId: request.senderId },
            ],
          },
          select: { id: true },
        });

        return existing
          ? tx.friendRequest.update({
              where: { id: existing.id },
              data: {
                senderId: request.senderId,
                receiverId: request.receiverId,
                type: request.type,
              },
            })
          : tx.friendRequest.create({
              data: {
                senderId: request.senderId,
                receiverId: request.receiverId,
                type: request.type,
              },
            });
      });

      return friendRequest;
    } catch (error) {
      console.log("Friend request database error");
      throw new Error("❌ Database error");
    }
  }

  async updateFriendRequestResponseById(
    id: string,
    response: boolean,
  ): Promise<FriendResponseDTO> {
    try {
      return await this.prisma.friendRequest.update({
        where: { id },
        data: {
          isAccepted: response,
          type:
            response === true
              ? "FRIEND_REQUEST_ACCEPTED"
              : "FRIEND_REQUEST_REJECTED",
        },
      });
    } catch (error) {
      console.log("Friend request response database error");
      throw new Error("❌ Database error");
    }
  }

  async getFriendRequestByName(
    name: string,
  ): Promise<FriendResponseDTO[] | null> {
    try {
      const payload = await this.prisma.friendRequest.findMany({
        where: {
          OR: [
            {
              sender: {
                name: {
                  contains: name,
                  mode: "insensitive",
                },
              },
            },
            {
              receiver: {
                name: {
                  contains: name,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      });

      return payload;
    } catch (error) {
      console.log("Friend request by name database error");
      throw new Error("❌ Database error");
    }
  }

  async getFriendRequestsById(
    userId: string,
  ): Promise<FriendRequestUserDTO[] | null> {
    try {
      const payload = await this.prisma.friendRequest.findMany({
        where: {
          receiverId: userId,
          isAccepted: null,
        },
        include: {
          sender: true,
        },
      });

      return payload;
    } catch (error) {
      console.log("Friend request by id database error");
      throw new Error("❌ Database error");
    }
  }

  async getFriendRequestsSentByUser(
    userId: string,
  ): Promise<FriendRequestSenderDTO[] | null> {
    try {
      const payload = await this.prisma.friendRequest.findMany({
        where: {
          senderId: userId,
          isAccepted: null,
        },
        include: {
          receiver: true,
        },
      });

      return payload;
    } catch (error) {
      console.log("Friend request by sender database error");
      throw new Error("❌ Database error");
    }
  }
}
