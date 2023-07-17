import { NotificationTag } from '@/components/Notifications/NotificationTag.tsx';
import { ProposalStatusKey } from '@/constants.ts';

export interface NotificationCardProps {
  title: string;
  description: string;
  tag: ProposalStatusKey;
}

const MAX_DESCRIPTION_LENGTH = 130;

export function NotificationCard({ tag, title, description }: NotificationCardProps) {
  const longerDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const trimmedDescription = longerDescription ? `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : description;

  return (
    <div className="flex flex-col items-start gap-4 self-stretch rounded-xl bg-subtle p-6">
      <h4 className="text-xl font-semibold not-italic leading-7 text-white">{title}</h4>
      <p
        className="text-base font-normal not-italic leading-6 text-low-contrast"
        title={longerDescription ? description : undefined}
      >
        {trimmedDescription}
      </p>
      <NotificationTag tag={tag} />
    </div>
  );
}
