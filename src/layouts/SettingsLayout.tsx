import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { Header } from '@/components/Header';

export function SettingsLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Header.Root>
        <Header.Title>{t('settings')}</Header.Title>
      </Header.Root>
      <Outlet />
    </>
  );
}
