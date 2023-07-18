import { useContext } from 'react';

import { NotificationMapping } from '@/api/models/notifications.ts';
import { NotificationsContext } from '@/contexts/notifications.ts';

export function useNotifications(): {
  notifications: NotificationMapping | null;
  readNotification: (readNotificationKey: string) => void;
} {
  const { notifications, readNotification } = useContext(NotificationsContext);

  return {
    notifications,
    readNotification,
  };
}
