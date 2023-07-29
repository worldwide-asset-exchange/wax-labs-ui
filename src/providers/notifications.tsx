import { useQueries } from '@tanstack/react-query';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import adminEndVotingNotifications from '@/api/chain/notifications/adminEndVotingNotifications.ts';
import adminToReviewNotifications from '@/api/chain/notifications/adminToReviewNotifications.ts';
import proposerDeliverableNotifications from '@/api/chain/notifications/proposerDeliverableNotifications.ts';
import proposerEndVotingNotifications from '@/api/chain/notifications/proposerEndVotingNotifications.ts';
import reviewerDeliverableNotifications from '@/api/chain/notifications/reviewerDeliverableNotifications.ts';
import startVotingNotifications from '@/api/chain/notifications/startVotingNotifications.ts';
import { NotificationMapping } from '@/api/models/notifications.ts';
import { NotificationsContext } from '@/contexts/notifications.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useIsAdmin } from '@/hooks/useIsAdmin.ts';

const READ_NOTIFICATIONS_STORAGE = 'waxlabs:readNotifications';

export interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const { actor, isAuthenticated } = useChain();
  const storageKey = actor ? `${READ_NOTIFICATIONS_STORAGE}-${actor}` : null;
  const isAdmin = useIsAdmin();
  const [read, setRead] = useState<string[]>(getStorage(storageKey));

  const notificationResult = useQueries({
    queries: [
      {
        queryKey: ['proposerEndVotingNotifications', actor],
        queryFn: () => proposerEndVotingNotifications({ actor: actor as string }),
        refetchInterval: 10e3,
        refetchOnWindowFocus: false,
        enabled: !!isAuthenticated && !!actor,
      },
      {
        queryKey: ['startVotingNotifications', actor],
        queryFn: () => startVotingNotifications({ actor: actor as string }),
        refetchInterval: 10e3,
        refetchOnWindowFocus: false,
        enabled: !!isAuthenticated && !!actor,
      },
      {
        queryKey: ['proposerDeliverableNotifications', actor],
        queryFn: () => proposerDeliverableNotifications({ actor: actor as string }),
        refetchInterval: 10e3,
        refetchOnWindowFocus: false,
        enabled: !!isAuthenticated && !!actor,
      },
      {
        queryKey: ['reviewerDeliverableNotifications', actor],
        queryFn: () => reviewerDeliverableNotifications({ actor: actor as string }),
        refetchInterval: 10e3,
        refetchOnWindowFocus: false,
        enabled: !!isAuthenticated && !!actor,
      },
      {
        queryKey: ['adminEndVotingNotifications', actor, isAdmin],
        queryFn: () => (isAdmin ? adminEndVotingNotifications() : Promise.resolve([])),
        refetchInterval: 10e3,
        refetchOnWindowFocus: false,
        enabled: !!isAuthenticated && !!actor,
      },
      {
        queryKey: ['adminToReviewNotifications', actor, isAdmin],
        queryFn: () => (isAdmin ? adminToReviewNotifications() : Promise.resolve([])),
        refetchInterval: 10e3,
        refetchOnWindowFocus: false,
        enabled: !!isAuthenticated && !!actor,
      },
    ],
  });

  const readNotification = useCallback(
    (readNotificationKey: string) => {
      if (storageKey) {
        const readNotifications = getStorage(storageKey);

        if (!readNotifications.includes(readNotificationKey)) {
          setRead(appendAndSetStorage(storageKey, readNotificationKey));
        }
      }
    },
    [storageKey]
  );

  const notificationProviderValue = useMemo(
    () => ({
      notifications:
        notificationResult
          ?.filter(t => t.status == 'success')
          .reduce((previousValue, currentValue) => {
            if (currentValue?.data?.length) {
              currentValue.data
                .filter(n => !read.includes(n.readNotificationKey))
                .forEach(n => {
                  if (!previousValue[n.notificationType]) {
                    previousValue[n.notificationType] = [];
                  }

                  previousValue[n.notificationType].push(n);
                });
            }

            return previousValue;
          }, {} as NotificationMapping) ?? null,
      readNotification,
    }),
    [notificationResult, readNotification, read]
  );

  useEffect(() => {
    if (isAuthenticated && storageKey) {
      // handle what happens on key press
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === storageKey) {
          setRead(event.newValue ? JSON.parse(event.newValue) : []);
        }
      };

      // attach the event listener
      window.addEventListener('storage', handleStorageChange);

      // remove the event listener
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isAuthenticated, storageKey]);

  return <NotificationsContext.Provider value={notificationProviderValue}>{children}</NotificationsContext.Provider>;
}

const setStorage = (storageKey: string, readNotifications: string[]) => {
  const uniqKeys = new Set(Array.isArray(readNotifications) ? readNotifications : []);
  localStorage.setItem(storageKey, JSON.stringify(Array.from(uniqKeys)));
};

const getStorage = (storageKey: string | null): string[] => {
  const notifications = storageKey ? JSON.parse(localStorage.getItem(storageKey) ?? '[]') : [];
  return Array.isArray(notifications) ? notifications : [];
};

const appendAndSetStorage = (storageKey: string, notificationKey: string) => {
  const notifications = getStorage(storageKey);
  notifications.push(notificationKey);
  setStorage(storageKey, notifications);
  return notifications;
};
