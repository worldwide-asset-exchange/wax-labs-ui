import { createContext } from 'react';

import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationType } from '@/constants.ts';
import { noop } from '@/utils/common.ts';

export interface NotificationsContextOptions {
  readNotification: (readNotificationKey: string) => void;
  notifications: Record<NotificationType, WaxLabsNotification[]> | null;
}

export const NotificationsContext = createContext<NotificationsContextOptions>({
  readNotification: noop,
  notifications: null,
});
