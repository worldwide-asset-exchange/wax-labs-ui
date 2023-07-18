import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { accountProfile } from '@/api/chain/profile';
import { Profile } from '@/api/models/profile.ts';
import * as Header from '@/components/Header';
import { Link } from '@/components/Link';
import { useChain } from '@/hooks/useChain.ts';

import { ProfileCard } from './ProfileCard';

export function UserProfile() {
  const { t } = useTranslation();
  const { actor } = useChain();
  const { actor: actorParam } = useParams();

  const [profile, setProfile] = useState<Profile | null>(null);

  const getProfile = async () => {
    const response = await accountProfile(actor as string);
    setProfile(response);
  };

  getProfile();

  return (
    <>
      <Header.Root>
        <Header.Title>{t('profile')}</Header.Title>
      </Header.Root>
      <div className="mx-auto flex max-w-7xl items-center px-4">
        {profile ? (
          <ProfileCard
            imageUrl={profile?.image_url ?? ''}
            fullName={profile?.full_name ?? ''}
            biography={profile?.bio ?? ''}
            groupName={profile?.group_name ?? ''}
            country={profile?.country ?? ''}
            website={profile?.website ?? ''}
            telegram={profile?.contact ?? ''}
          />
        ) : (
          <div className="flex w-full items-center justify-between overflow-hidden rounded-xl bg-subtle p-4">
            <p className="subtitle-1 text-low-contrast">{actor == actorParam ? t('noProfile') : t('noUserProfile')}</p>
            {actor == actorParam ? (
              <Link to={'/' + actor + '/create'} variant="primary">
                {t('createProfile')}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
