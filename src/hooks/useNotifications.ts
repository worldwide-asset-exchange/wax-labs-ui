import { useContext } from 'react';

import { NotificationsContext } from '@/contexts/notifications.ts';

export function useNotifications() {
  const { notifications, readNotification, isLoading } = useContext(NotificationsContext);

  return {
    notifications,
    readNotification,
    isLoading,
  };
}
