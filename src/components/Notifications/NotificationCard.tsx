import { MdOutlineClose } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

import { Button } from '@/components/Button.tsx';
import { StatusTag } from '@/components/StatusTag.tsx';
import { ProposalStatusKey } from '@/constants.ts';
import { useNotifications } from '@/hooks/useNotifications.ts';
import { toProposalStatus } from '@/utils/proposalUtils.ts';

export interface NotificationCardProps {
  readNotificationKey: string;
  title: string;
  description: string;
  status: ProposalStatusKey;
  proposalId: number;
}

const MAX_DESCRIPTION_LENGTH = 130;

export function NotificationCard({
  readNotificationKey,
  status,
  title,
  description,
  proposalId,
}: NotificationCardProps) {
  const { readNotification } = useNotifications();
  const longerDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const trimmedDescription = longerDescription ? `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : description;

  return (
    <div className="flex flex-col items-start gap-4 self-stretch rounded-xl bg-subtle p-6">
      <div className="flex w-full flex-nowrap items-center">
        <NavLink to={`/proposals/${proposalId}/edit`} className="flex-auto">
          <h4 className="text-xl font-semibold not-italic leading-7 text-white">{title}</h4>
        </NavLink>

        <Button square variant="link" onClick={() => readNotification(readNotificationKey)}>
          <MdOutlineClose size={24} />
        </Button>
      </div>

      <p
        className="text-base font-normal not-italic leading-6 text-low-contrast"
        title={longerDescription ? description : undefined}
      >
        {trimmedDescription}
      </p>
      <StatusTag status={toProposalStatus(status)} />
    </div>
  );
}
