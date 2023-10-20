import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationCard } from '@/components/Notifications/NotificationCard.tsx';

export interface NotificationCardProps {
  title: string;
  notifications: WaxLabsNotification[];
}

export function NotificationGroup({ title, notifications }: NotificationCardProps) {
  return (
    <div className="flex flex-col items-start gap-4 px-6 py-4">
      <h4 className="text-xl font-semibold not-italic leading-7 text-white">{title}</h4>
      {notifications?.map(n => (
        <NotificationCard
          key={n.readNotificationKey}
          readNotificationKey={n.readNotificationKey}
          title={n.title}
          status={n.status}
          description={n.summary}
          proposalId={n.id}
        />
      ))}
    </div>
  );
}
