import { useTranslation } from 'react-i18next';

export function NoNotificationCard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start gap-4 self-stretch bg-subtle p-6">
      <p className="text-base font-normal not-italic leading-6 text-low-contrast">
        {t('notifications.noNotifications')}
      </p>
    </div>
  );
}
