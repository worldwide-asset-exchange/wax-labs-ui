import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLightbulbOutline, MdOutlineAccountBalanceWallet, MdPerson, MdPersonOutline } from 'react-icons/md';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import { accountProfile } from '@/api/chain/profile';
import { Profile } from '@/api/models/actions';
import { Button } from '@/components/Button';
import * as Header from '@/components/Header';
import * as Tabs from '@/components/Tabs';
import { ContentSkeleton } from '@/contents/ContentSkeleton';
import { useChain } from '@/hooks/useChain.ts';
import { imageExists } from '@/utils/image';

export function ProfileLayout() {
  const { t } = useTranslation();
  const { logout, isAuthenticated, actor } = useChain();

  const { actor: actorParam } = useParams();

  const [avatar, setAvatar] = useState(<MdPerson className="text-low-contrast" size={40} />);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', actor],
    queryFn: () =>
      accountProfile(actor as string).then(response => {
        if (response) {
          return response;
        } else {
          return {} as Profile;
        }
      }),
  });

  useEffect(() => {
    imageExists(profile?.image_url ?? '')
      .then(() => setAvatar(<img className="h-full w-full rounded-full object-cover" src={profile?.image_url} />))
      .catch(() => setAvatar(<MdPerson className="text-low-contrast" size={40} />));
  }, [profile?.image_url]);

  if (isAuthenticated == null || isLoading) {
    return <ContentSkeleton />;
  }

  return (
    <>
      <Header.Root>
        <div className="flex w-full items-center gap-4">
          <div className="flex h-20 min-h-[80px] w-20 min-w-[80px] items-center justify-center rounded-full border-2">
            {avatar}
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
