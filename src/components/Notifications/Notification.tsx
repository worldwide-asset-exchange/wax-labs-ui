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

import { Button } from '@/components/Button.tsx';
import * as Nav from '@/components/Nav';
import { NotificationGroup } from '@/components/Notifications/NotificationGroup.tsx';
import { NotificationType } from '@/constants.ts';
import { useNotifications } from '@/hooks/useNotifications.ts';

export function Notification() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  const { notifications } = useNotifications();

  return (
    <>
      <Nav.Button onClick={() => setOpen(prevState => !prevState)}>
        {notifications && Object.keys(notifications).length > 0 && (
          <span className="absolute right-3 top-3 block h-2 w-2 rounded-full bg-accent"></span>
        )}
        <MdOutlineNotifications size={24} />
      </Nav.Button>
      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-40 block bg-app/50" />
          <DialogContent className="fixed right-0 top-0 z-50 h-full max-h-screen w-full overflow-y-auto bg-app shadow-2xl transition-transform delay-150 duration-300 data-[state=closed]:hidden md:max-w-lg md:rounded-md max-md:h-full">
            <header className="sticky top-0 flex items-center gap-4 border-b border-subtle-light bg-app px-4 py-2">
              <DialogClose asChild>
                <Button square variant="tertiary">
                  <MdOutlineClose size={24} />
                </Button>
              </DialogClose>
              <DialogTitle className="title-3 text-high-contrast">Notification</DialogTitle>
            </header>

            {notifications?.[NotificationType.REJECTED_DELIVERABLE]?.length && (
              <NotificationGroup
                title={t('notifications.deliverablesRejected')}
                notifications={notifications[NotificationType.REJECTED_DELIVERABLE]}
              />
            )}
            {notifications?.[NotificationType.CLAIM_DELIVERABLE]?.length && (
              <NotificationGroup
                title={t('notifications.deliverablesReadyToBeClaimed')}
                notifications={notifications[NotificationType.CLAIM_DELIVERABLE]}
              />
            )}

            {notifications?.[NotificationType.PROPOSAL_IN_PROGRESS]?.length && (
              <NotificationGroup
                title={t('notifications.proposalsInProgress')}
                notifications={notifications[NotificationType.PROPOSAL_IN_PROGRESS]}
              />
            )}

            {notifications?.[NotificationType.DELIVERABLES_TO_REVIEW]?.length && (
              <NotificationGroup
                title={t('notifications.deliverablesInReview')}
                notifications={notifications[NotificationType.DELIVERABLES_TO_REVIEW]}
              />
            )}
            {notifications?.[NotificationType.REVIEW_PENDING]?.length && (
              <NotificationGroup
                title={t('notifications.toBeReview')}
                notifications={notifications[NotificationType.REVIEW_PENDING]}
              />
            )}

            {notifications?.[NotificationType.ADMIN_PROPOSAL_END_VOTING]?.length && (
              <NotificationGroup
                title={t('notifications.adminEndVoting')}
                notifications={notifications[NotificationType.ADMIN_PROPOSAL_END_VOTING]}
              />
            )}

            {notifications?.[NotificationType.START_VOTING]?.length && (
              <NotificationGroup
                title={t('notifications.startVoting')}
                notifications={notifications[NotificationType.START_VOTING]}
              />
            )}
            {notifications?.[NotificationType.PROPOSAL_END_VOTING]?.length && (
              <NotificationGroup
                title={t('notifications.endVoting')}
                notifications={notifications[NotificationType.PROPOSAL_END_VOTING]}
              />
            )}
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </>
  );
}
