import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationCard } from '@/components/Notifications/NotificationCard.tsx';

export interface NotificationCardProps {
  title: string;
  notifications: WaxLabsNotification[];
  borderTop?: boolean;
  borderBottom?: boolean;
}

export function NotificationGroup({
  title,
  notifications,
  borderTop = false,
  borderBottom = false,
}: NotificationCardProps) {
  const classNames = [
    'flex',
    'flex-col',
    'items-start',
    'gap-4',
    'px-6',
    'py-4',
    borderBottom ? '' : null,
    borderTop ? '' : null,
  ]
    .filter(Boolean)
    .join(' ');

  console.log('notifications', notifications);

  return (
    <div className={classNames}>
      <h4 className="text-xl font-semibold not-italic leading-7 text-white">{title}</h4>
      {notifications?.map(n => (
        <NotificationCard title={n.title} tag={n.status} key={n.readNotificationKey} description={n.summary} />
      ))}
    </div>
  );
}
