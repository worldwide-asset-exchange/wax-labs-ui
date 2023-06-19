import { NotificationType } from '@/constants.ts';

export interface WaxLabsNotification {
  notificationType: NotificationType;
  id: number | string;
}
