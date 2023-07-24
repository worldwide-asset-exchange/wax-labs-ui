import { useTranslation } from 'react-i18next';
import { MdLightbulbOutline, MdOutlineAccountBalanceWallet, MdPerson, MdPersonOutline } from 'react-icons/md';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import * as Tabs from '@/components/Tabs';
import { ContentSkeleton } from '@/contents/ContentSkeleton';
import { useChain } from '@/hooks/useChain.ts';
import { useProfile } from '@/hooks/useProfile';

export function ProfileLayout() {
  const { t } = useTranslation();
  const { logout, isAuthenticated, actor } = useChain();

  const { actor: actorParam } = useParams();
  const { profile, isLoadingProfile } = useProfile({ actor: actorParam as string });

  if (isAuthenticated == null || isLoadingProfile) {
    return <ContentSkeleton />;
  }

  return (
    <>
      <header className="mx-auto flex max-w-7xl items-center px-4 py-8">
        <div className="flex flex-1 items-center gap-4 overflow-hidden">
          <div className="flex-none">
            <div className="flex h-20 min-h-[80px] w-20 min-w-[80px] items-center justify-center rounded-full border-2 border-high-contrast">
              {profile?.image_url ? (
                <img className="h-full w-full rounded-full object-cover" src={profile?.image_url} alt="" />
              ) : (
                <MdPerson className="text-low-contrast" size={40} />
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="title-1 truncate text-high-contrast">{profile?.full_name ?? actorParam}</h1>
            <p className="subtitle-1 truncate text-high-contrast">{actorParam}</p>
          </div>
        </div>
        {actor == actorParam && (
          <div className="flex-none">
            <Button variant="tertiary" square onClick={logout}>
              {t('logOut')}
            </Button>
          </div>
        )}
      </header>
      <Tabs.Root>
        <NavLink to="" end>
          {({ isActive }) => (
            <Tabs.Item active={isActive}>
              <MdLightbulbOutline size={24} />
              {t('proposals')}
            </Tabs.Item>
          )}
        </NavLink>
        <NavLink to="profile" end>
          {({ isActive }) => (
            <Tabs.Item active={isActive}>
              <MdPersonOutline size={24} />
              {t('profile')}
            </Tabs.Item>
          )}
        </NavLink>
        {actor == actorParam && (
          <NavLink to="balance" end>
            {({ isActive }) => (
              <Tabs.Item active={isActive}>
                <MdOutlineAccountBalanceWallet size={24} />
                {t('balance')}
              </Tabs.Item>
            )}
          </NavLink>
        )}
      </Tabs.Root>
      <Outlet />
    </>
  );
}
