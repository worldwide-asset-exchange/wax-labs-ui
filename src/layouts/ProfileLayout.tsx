import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLightbulbOutline, MdOutlineAccountBalanceWallet, MdPersonOutline } from 'react-icons/md';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import { accountProfile } from '@/api/chain/profile';
import { Profile } from '@/api/models/profile.ts';
import { Button } from '@/components/Button';
import * as Header from '@/components/Header';
import * as Tabs from '@/components/Tabs';
import { useChain } from '@/hooks/useChain.ts';

export function ProfileLayout() {
  const { t } = useTranslation();
  const { logout, isAuthenticated, actor } = useChain();

  const { actor: actorParam } = useParams();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    accountProfile(actor as string).then(response => {
      setProfile(response);
    });
  }, [actor]);

  if (isAuthenticated == null) {
    // TODO: Replace by Loading component
    return <>Loading</>;
  }

  return (
    <>
      <Header.Root>
        <div className="flex w-full items-center gap-4">
          <div className="h-20 min-h-[80px] w-20 min-w-[80px] rounded-full border-2">
            {/* TODO: Substitute empty for placeholder image when available */}
            <img src={profile?.image_url ?? ''} />
          </div>
          <div className="w-full flex-col gap-1">
            <h1 className="title-1 text-high-contrast">{profile?.full_name ?? actorParam}</h1>
            <h2 className="subtitle-1 text-high-contrast">{actorParam}</h2>
          </div>
          <div className="flex min-w-[120px] justify-end">
            {actor == actorParam ? (
              <Button variant="tertiary" onClick={logout}>
                {t('logOut')}
              </Button>
            ) : null}
          </div>
        </div>
      </Header.Root>
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
        {actor == actorParam ? (
          <NavLink to="balance" end>
            {({ isActive }) => (
              <Tabs.Item active={isActive}>
                <MdOutlineAccountBalanceWallet size={24} />
                {t('balance')}
              </Tabs.Item>
            )}
          </NavLink>
        ) : null}
      </Tabs.Root>
      <Outlet />
    </>
  );
}
