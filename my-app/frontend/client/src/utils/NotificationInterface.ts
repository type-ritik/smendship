// Backend NotificationPayload (Query.retriveUserNotifications)
export interface NotifyInterface {
  id: string;
  type: string;
  fromUserId: string;
  toUserId: string;
  postId?: string | null;
  isRead: boolean | null;
  notifiedAt: string;
  user1?: { id: string; name: string } | null;
  post?: { id: string; title?: string | null; content?: string | null } | null;
}
