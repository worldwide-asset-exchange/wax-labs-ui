import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import adminEndVotingNotifications from '@/api/chain/notifications/adminEndVotingNotifications.ts';
import adminToReviewNotifications from '@/api/chain/notifications/adminToReviewNotifications.ts';
import proposerDeliverableNotifications from '@/api/chain/notifications/proposerDeliverableNotifications.ts';
import proposerEndVotingNotifications from '@/api/chain/notifications/proposerEndVotingNotifications.ts';
import reviewerDeliverableNotifications from '@/api/chain/notifications/reviewerDeliverableNotifications.ts';
import startVotingNotifications from '@/api/chain/notifications/startVotingNotifications.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';

const READ_NOTIFICATIONS_STORAGE = 'waxlabs:readNotifications';

const setStorage = (readNotifications: string[]) => {
  localStorage.setItem(READ_NOTIFICATIONS_STORAGE, JSON.stringify(readNotifications));
};

const getStorage = (): string[] => {
  return JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_STORAGE) || '[]');
};

const appendAndSetStorage = (notificationKey: string) => {
  const notifications = getStorage();
  notifications.push(notificationKey);
  setStorage(notifications);
  return notifications;
};

export function useNotifications({ accountName, isAdmin = false }: { accountName: string; isAdmin?: boolean }): {
  notifications: WaxLabsNotification[];
  readNotification: (notification: WaxLabsNotification) => void;
} {
  const [read, setRead] = useState<string[]>(getStorage());

  const { data: notificationResult } = useQuery<WaxLabsNotification[]>({
    queryFn: () => {
      const promises = [
        proposerEndVotingNotifications({ accountName }),
        startVotingNotifications({ accountName }),
        proposerDeliverableNotifications({ accountName }),
        reviewerDeliverableNotifications({ accountName }),
      ];

      if (isAdmin) {
        promises.push(adminEndVotingNotifications(), adminToReviewNotifications());
      }

      return Promise.all(promises).then(notifications => notifications.flat());
    },
    queryKey: [accountName, isAdmin],
    refetchInterval: 10e4,
  });

  const readNotification = useCallback((notification: WaxLabsNotification) => {
    const readNotifications = getStorage();

    if (!readNotifications.includes(notification.readNotificationKey)) {
      setRead(appendAndSetStorage(notification.readNotificationKey));
    }
  }, []);

  return {
    notifications:
      notificationResult?.filter(n => {
        const filterReadNotifications = read.length ? read : getStorage();
        return !filterReadNotifications.includes(n.readNotificationKey);
      }) ?? [],
    readNotification,
  };
}
