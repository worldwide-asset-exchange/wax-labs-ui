import { useTranslation } from 'react-i18next';

import * as Header from '@/components/Header';

import { ProfileCard } from './ProfileCard';

export function Profile() {
  const { t } = useTranslation();

  return (
    <>
      <Header.Root>
        <Header.Title>{t('profile')}</Header.Title>
      </Header.Root>
      <div className="mx-auto flex max-w-7xl items-center px-4">
        <ProfileCard
          // biography={profile.biography}
          // groupName={profile.groupName}
          // country={profile.country}
          // website={profile.website}
          // telegram={profile.telegram}
          biography="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa magna, maximus et purus sit amet, mattis luctus nulla. Nunc est dui, tempus et augue at, posuere sodales diam."
          groupName="Detroit Ledger Tech"
          country="Canada"
          website="https://detroitledger.tech/"
          telegram="hyogasereiou"
        />
      </div>
    </>
  );
}
