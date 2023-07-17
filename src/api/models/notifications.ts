import { NotificationType, ProposalStatusKey } from '@/constants.ts';

export interface WaxLabsNotification {
  notificationType: NotificationType;
  readNotificationKey: string;
  id: number;
  title: string;
  summary: string;
  status: ProposalStatusKey;
}
