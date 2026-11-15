import {
  CreatePostNotificationDTO,
  NotificationPostResponseDTO,
} from "../models/Notification";

export interface INotificationRepository {
  create(
    notice: CreatePostNotificationDTO,
  ): Promise<NotificationPostResponseDTO>;
  findAllNotificationByUserId(
    userId: string,
  ): Promise<NotificationPostResponseDTO[]>;
  searchNotificationByType(
    type: string,
  ): Promise<NotificationPostResponseDTO[]>;
  delete(id: string): Promise<{ response: string }>;
}
