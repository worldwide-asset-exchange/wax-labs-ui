import { createContext } from 'react';

import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { noop } from '@/utils/common.ts';

export interface NotificationsContextOptions {
  readNotification: (notification: WaxLabsNotification) => void;
  notifications: WaxLabsNotification[];
}

export const NotificationsContext = createContext<NotificationsContextOptions>({
  readNotification: noop,
  notifications: [],
});
