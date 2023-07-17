import {
  Close as DialogClose,
  Content as DialogContent,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineClose, MdOutlineNotifications } from 'react-icons/md';

import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { Button } from '@/components/Button.tsx';
import * as Nav from '@/components/Nav';
import { NotificationGroup } from '@/components/Notifications/NotificationGroup.tsx';
import { NotificationType } from '@/constants.ts';
import { useNotifications } from '@/hooks/useNotifications.ts';

export function Notification() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(true);
  // const [open, setOpen] = useState<boolean>(false);

  const { notifications } = useNotifications();

  const notificationMapping = notifications?.reduce((previousValue, notification) => {
    if (!previousValue[notification.notificationType]) {
      previousValue[notification.notificationType] = [];
    }

    previousValue[notification.notificationType].push(notification);

    return previousValue;
  }, {} as Record<NotificationType, WaxLabsNotification[]>);

  return (
    <>
      <Nav.Button onClick={() => setOpen(prevState => !prevState)}>
        <MdOutlineNotifications size={24} />
      </Nav.Button>
      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-40 block bg-app/50" />
          <DialogContent className="fixed right-0 top-0 z-50 h-full max-h-screen w-full overflow-y-auto bg-app shadow-2xl transition-transform delay-150 duration-300 data-[state=closed]:hidden md:max-w-lg md:rounded-md max-md:h-full">
            <header className="sticky top-0 flex items-center gap-4 border-b border-subtle-light px-4 py-2">
              <DialogClose asChild>
                <Button square variant="tertiary">
                  <MdOutlineClose size={24} />
                </Button>
              </DialogClose>
              <DialogTitle className="title-3 text-high-contrast">Notification</DialogTitle>
            </header>

            {Object.entries(NotificationType)
              .filter((_, notificationType: NotificationType) => notificationMapping?.[notificationType]?.length > 0)
              .map((_, notificationType: NotificationType) => (
                <NotificationGroup
                  key={notificationType}
                  title={t('notifications.deliverablesInReview')}
                  notifications={notificationMapping[notificationType]}
                />
              ))}
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </>
  );
}
