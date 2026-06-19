export interface NotifyInterface {
  id: string;
  type: string;
  fromUserId: {
    id: string;
    name: string;
  };
  post: {
    id: string;
    content: string;
  };
  isRead: boolean;
  notifiedAt: Date;
}
