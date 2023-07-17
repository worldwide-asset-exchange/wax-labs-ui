import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { accountProfile } from '@/api/chain/profile';
import { Profile } from '@/api/models/profile.ts';
import * as Header from '@/components/Header';
import { useChain } from '@/hooks/useChain.ts';

import { ProfileCard } from './ProfileCard';

export function UserProfile() {
  const { t } = useTranslation();
  const { actor } = useChain();

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
        <ProfileCard
          biography={profile?.bio ?? ''}
          groupName={profile?.group_name ?? ''}
          country={profile?.country ?? ''}
          website={profile?.website ?? ''}
          telegram={profile?.contact ?? ''}
        />
      </div>
    </>
  );
}
