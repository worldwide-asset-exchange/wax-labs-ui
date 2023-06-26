import { NotificationType } from '@/constants.ts';

export interface WaxLabsNotification {
  notificationType: NotificationType;
  readNotificationKey: string;
  id: number;
}
