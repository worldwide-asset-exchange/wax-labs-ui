import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import proposerEndVotingNotifications from '@/api/chain/notifications/proposerEndVotingNotifications.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';

const READ_NOTIFICATIONS_STORAGE = 'waxlabs:readNotifications';

export function useNotifications({ accountName }: { accountName: string }): {
  notifications: WaxLabsNotification[];
  readNotification: (notification: WaxLabsNotification) => void;
} {
  const [notifications, setNotifications] = useState<WaxLabsNotification[]>([]);

  useInterval(() => {
    Promise.all([proposerEndVotingNotifications({ accountName })]).then(notifications => {
      setNotifications(notifications.flat());
    });
  }, 10e3);

  const readNotification = (notification: WaxLabsNotification) => {
    const readNotificationKey = `${notification.notificationType}-${notification.id}`;
    const readNotifications = JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_STORAGE) || '[]');

    if (!readNotifications.includes(readNotificationKey)) {
      readNotifications.push(readNotificationKey);
      localStorage.setItem(READ_NOTIFICATIONS_STORAGE, JSON.stringify(readNotifications));
    }
  };

  return {
    notifications,
    readNotification,
  };
}
