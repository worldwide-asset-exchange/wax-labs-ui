import { useTranslation } from 'react-i18next';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineAttachMoney,
  MdOutlineHowToVote,
  MdOutlineLabel,
  MdOutlinePersonRemove,
} from 'react-icons/md';
import { NavLink, Outlet } from 'react-router-dom';

import { Header } from '@/components/Header';
import * as Tabs from '@/components/Tabs';

export function SettingsLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Header.Root>
        <Header.Title>{t('settings')}</Header.Title>
      </Header.Root>
      <Tabs.Root>
        <NavLink to="" end>
          {({ isActive }) => (
            <Tabs.Item active={isActive}>
              <MdOutlineLabel size={24} />
              {t('categories')}
            </Tabs.Item>
          )}
        </NavLink>
        <NavLink to="voting-period" end>
          {({ isActive }) => (
            <Tabs.Item active={isActive}>
              <MdOutlineHowToVote size={24} />
              {t('votingPeriod')}
            </Tabs.Item>
          )}
        </NavLink>
        <NavLink to="remove-profile" end>
          {({ isActive }) => (
            <Tabs.Item active={isActive}>
              <MdOutlinePersonRemove size={24} />
              {t('removeProfile')}
            </Tabs.Item>
          )}
        </NavLink>
        <NavLink to="admin-role" end>
          {({ isActive }) => (
            <Tabs.Item active={isActive}>
              <MdOutlineAdminPanelSettings size={24} />
              {t('adminRole')}
            </Tabs.Item>
          )}
        </NavLink>
        <NavLink to="usd-requested" end>
          {({ isActive }) => (
            <Tabs.Item active={isActive}>
              <MdOutlineAttachMoney size={24} />
              {t('USDRequested')}
            </Tabs.Item>
          )}
        </NavLink>
      </Tabs.Root>
      <Outlet />
    </>
  );
}
