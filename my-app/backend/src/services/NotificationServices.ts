import { NotificationPostResponseDTO } from "../models/Notification";
import { INotificationRepository } from "../repositories/INotificationRepository";
import { SubscriptionService } from "./SubscriptionService";

export class NotificationService {
  constructor(
    private notificationRepository: INotificationRepository,
    private subscriptionService: SubscriptionService,
  ) {}

  public async createNotification(
    userId: string,
    receiverId: string,
    type: string,
    postId: string,
  ): Promise<{ response: string }> {
    const notice = {
      fromUserId: userId,
      toUserId: receiverId,
      type: type,
      postId: postId ? postId : "",
    };

    const notification = await this.notificationRepository.create(notice);

    await this.subscriptionService.notify(receiverId, notification);

    return { response: "Notification send successfully." };
  }

  public async getAllNotificationOfUser(
    userId: string,
  ): Promise<NotificationPostResponseDTO[]> {
    const payload =
      await this.notificationRepository.findAllNotificationByUserId(userId);

    return payload;
  }

  public async searchNotification(
    type: string,
  ): Promise<NotificationPostResponseDTO[]> {
    const payload =
      await this.notificationRepository.searchNotificationByType(type);

    return payload;
  }

  public async deleteNotification(id: string): Promise<{ response: string }> {
    const payload = await this.notificationRepository.delete(id);

    return payload;
  }
}
