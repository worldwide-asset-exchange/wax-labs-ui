import { useQuery } from '@tanstack/react-query';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import adminEndVotingNotifications from '@/api/chain/notifications/adminEndVotingNotifications.ts';
import adminToReviewNotifications from '@/api/chain/notifications/adminToReviewNotifications.ts';
import proposerDeliverableNotifications from '@/api/chain/notifications/proposerDeliverableNotifications.ts';
import proposerEndVotingNotifications from '@/api/chain/notifications/proposerEndVotingNotifications.ts';
import reviewerDeliverableNotifications from '@/api/chain/notifications/reviewerDeliverableNotifications.ts';
import startVotingNotifications from '@/api/chain/notifications/startVotingNotifications.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationsContext } from '@/contexts/notifications.ts';
import { useChain } from '@/hooks/useChain.ts';

const READ_NOTIFICATIONS_STORAGE = 'waxlabs:readNotifications';

export interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const { actor: accountName, isAuthenticated } = useChain();
  const isAdmin = false;
  const [read, setRead] = useState<string[]>(getStorage());
  const { data: notificationResult } = useQuery<WaxLabsNotification[]>({
    queryFn: () => {
      console.log('accountName', accountName);

      if (accountName) {
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
      }

      return Promise.resolve([]);
    },
    queryKey: [accountName, isAuthenticated, isAdmin],
    // refetchInterval: 10e4,
    enabled: isAuthenticated,
  });

  console.log('notificationResult', notificationResult);

  const readNotification = useCallback((notification: WaxLabsNotification) => {
    const readNotifications = getStorage();

    if (!readNotifications.includes(notification.readNotificationKey)) {
      setRead(appendAndSetStorage(notification.readNotificationKey));
    }
  }, []);
  const notificationProviderValue = useMemo(
    () => ({
      notifications: notificationResult?.filter(n => !read.includes(n.readNotificationKey)) ?? [],
      readNotification,
    }),
    [notificationResult, readNotification, read]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      // handle what happens on key press
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === READ_NOTIFICATIONS_STORAGE) {
          setRead(getStorage());
        }
      };

      // attach the event listener
      window.addEventListener('storage', handleStorageChange);

      // remove the event listener
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isAuthenticated]);

  return <NotificationsContext.Provider value={notificationProviderValue}>{children}</NotificationsContext.Provider>;
}

const setStorage = (readNotifications: string[]) => {
  localStorage.setItem(
    READ_NOTIFICATIONS_STORAGE,
    JSON.stringify(new Set(Array.isArray(readNotifications) ? readNotifications : []).values())
  );
};

const getStorage = (): string[] => {
  const notifications = JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_STORAGE) || '[]');
  return Array.isArray(notifications) ? notifications : [];
};

const appendAndSetStorage = (notificationKey: string) => {
  const notifications = getStorage();
  notifications.push(notificationKey);
  setStorage(notifications);
  return notifications;
};
