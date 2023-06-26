import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import adminEndVotingNotifications from '@/api/chain/notifications/adminEndVotingNotifications.ts';
import adminToReviewNotifications from '@/api/chain/notifications/adminToReviewNotifications.ts';
import proposerDeliverableNotifications from '@/api/chain/notifications/proposerDeliverableNotifications.ts';
import proposerEndVotingNotifications from '@/api/chain/notifications/proposerEndVotingNotifications.ts';
import reviewerDeliverableNotifications from '@/api/chain/notifications/reviewerDeliverableNotifications.ts';
import startVotingNotifications from '@/api/chain/notifications/startVotingNotifications.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';

const READ_NOTIFICATIONS_STORAGE = 'waxlabs:readNotifications';

export function useNotifications({ accountName, isAdmin = false }: { accountName: string; isAdmin?: boolean }): {
  notifications: WaxLabsNotification[];
  readNotification: (notification: WaxLabsNotification) => void;
} {
  const [notifications, setNotifications] = useState<WaxLabsNotification[]>([]);
  const [readNotifications, setReadNotifications] = useState<string[]>(
    JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_STORAGE) || '[]')
  );

  const fetchNotifications: () => Promise<WaxLabsNotification[]> = useCallback(() => {
    const promises = [
      proposerEndVotingNotifications({ accountName }),
      startVotingNotifications({ accountName }),
      proposerDeliverableNotifications({ accountName }),
      reviewerDeliverableNotifications({ accountName }),
    ];

    if (isAdmin) {
      promises.push(adminEndVotingNotifications(), adminToReviewNotifications());
    }

    return Promise.all(promises).then(notifications =>
      notifications.flat().filter(n => !readNotifications.includes(n.readNotificationKey))
    );
  }, [accountName, isAdmin, readNotifications]);

  useInterval(() => {
    fetchNotifications().then(notifications => {
      setNotifications(notifications);
    });
  }, 10e3);

  useEffect(() => {
    fetchNotifications().then(notifications => {
      setNotifications(notifications);
    });
  }, []);

  const readNotification = useCallback(
    (notification: WaxLabsNotification) => {
      if (!readNotifications.includes(notification.readNotificationKey)) {
        readNotifications.push(notification.readNotificationKey);
        localStorage.setItem(READ_NOTIFICATIONS_STORAGE, JSON.stringify(readNotifications));
        setReadNotifications(readNotifications);
      }
    },
    [readNotifications]
  );

  return {
    notifications,
    readNotification,
  };
}
