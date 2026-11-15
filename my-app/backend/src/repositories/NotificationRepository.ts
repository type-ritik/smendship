import { PrismaClient } from "@prisma/client";
import { INotificationRepository } from "./INotificationRepository";
import {
  CreateNotificationDTO,
  NotificationResponseDTO,
  NotificationPostResponseDTO,
  CreatePostNotificationDTO,
} from "../models/Notification";

export class NotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    notice: CreatePostNotificationDTO,
  ): Promise<NotificationPostResponseDTO> {
    try {
      return await this.prisma.notification.create({
        data: {
          fromUserId: notice.fromUserId,
          toUserId: notice.toUserId,
          type: notice.type,
          ...(notice.postId ? { postId: notice.postId } : {}),
        },
      });
    } catch (error) {
      console.log("Notification database error: ", error);
      throw new Error("Database error");
    }
  }

  async findAllNotificationByUserId(
    userId: string,
  ): Promise<NotificationPostResponseDTO[]> {
    try {
      return await this.prisma.notification.findMany({
        where: {
          toUserId: userId,
        },
      });
    } catch (error) {
      console.log("Notification database error: ", error);
      throw new Error("Database error");
    }
  }

  async searchNotificationByType(
    type: string,
  ): Promise<NotificationPostResponseDTO[]> {
    try {
      return await this.prisma.notification.findMany({
        where: {
          type: {
            contains: type,
            mode: "insensitive",
          },
        },
      });
    } catch (error) {
      console.log("Notification database error: ", error);
      throw new Error("Database error");
    }
  }

  async delete(id: string): Promise<{ response: string }> {
    try {
      const payload = await this.prisma.notification.delete({
        where: {
          id,
        },
      });

      return {
        response: "Notification is deleted Successfully.",
      };
    } catch (error) {
      console.log("Notification database error: ", error);
      throw new Error("Database error");
    }
  }
}
