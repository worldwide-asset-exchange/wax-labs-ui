import { useContext } from 'react';

import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationsContext } from '@/contexts/notifications.ts';

export function useNotifications(): {
  notifications: WaxLabsNotification[];
  readNotification: (notification: WaxLabsNotification) => void;
} {
  const { notifications, readNotification } = useContext(NotificationsContext);

  return {
    notifications,
    readNotification,
  };
}
