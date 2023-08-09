export enum TypeNotifications {
  FOLLOW = 'FOLLOW',
  LIKE_POST = 'LIKE_POST',
  COMMENT = 'COMMENT',
}

export interface Notifications {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: TypeNotifications | string;
  postId: number;
  commentId: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  isRead: boolean;
}
