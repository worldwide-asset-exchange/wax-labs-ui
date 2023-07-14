import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import * as Header from '@/components/Header';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import profilePlaceholders from '@/contents/profile/profilePlaceholders';

export function EditProfile() {
  const { t } = useTranslation();

  const randomProfile = Math.floor(Math.random() * 10);

  const [profile, setProfile] = useState(profilePlaceholders[randomProfile]);

  useEffect(() => {
    if (!profile) {
      setProfile(profilePlaceholders[randomProfile]);
    }
  }, [randomProfile, profile]);

  return (
    <>
      <Header.Root>
        <Header.Title>{t('editProfile')}</Header.Title>
      </Header.Root>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden rounded-xl bg-subtle p-8">
        <Input
          // {...register('avatar')}
          // error={errors.avatar?.message}
          value={profile?.avatar ?? null}
          label={t('avatar') as string}
          placeholder={profile?.avatar ?? (t('avatarPlaceholder') as string)}
          maxLength={64}
        />
        <Input
          // {...register('fullName')}
          // error={errors.fullName?.message}
          value={profile?.fullName ?? null}
          label={t('fullName') as string}
          placeholder={profile?.fullName ?? (t('fullNamePlaceholder') as string)}
          maxLength={64}
        />
        <TextArea
          // {...register('biography')}
          // error={errors.biography?.message}
          value={profile?.biography ?? null}
          label={t('biography') as string}
          placeholder={profile?.biography ?? (t('biographyPlaceholder') as string)}
          rows={3}
          maxLength={256}
        />
        <div className="flex w-full gap-6">
          <div className="flex w-full flex-col gap-6">
            <Input
              // {...register('groupName')}
              // error={errors.groupName?.message}
              value={profile?.groupName ?? null}
              label={t('groupName') as string}
              placeholder={profile?.groupName ?? (t('groupNamePlaceholder') as string)}
              maxLength={64}
            />
            <Input
              // {...register('website')}
              // error={errors.website?.message}
              value={profile?.website ?? null}
              placeholder={profile?.website ?? (t('websitePlaceholder') as string)}
              label={t('website') as string}
              maxLength={64}
            />
          </div>
          <div className="flex w-full flex-col gap-6">
            <Input
              // {...register('country')}
              // error={errors.country?.message}
              value={profile?.country ?? null}
              placeholder={profile?.country ?? (t('countryPlaceholder') as string)}
              label={t('country') as string}
              maxLength={64}
            />
            <Input
              // {...register('telegram')}
              // error={errors.telegram?.message}
              value={profile?.telegramHandle ?? null}
              placeholder={profile?.telegramHandle ?? (t('telegramHandlePlaceholder') as string)}
              label={t('telegramHandle') as string}
              maxLength={64}
            />
          </div>
        </div>
        <div className="flex w-full justify-end gap-3">
          <Button variant="tertiary" onClick={() => console.debug('Remove profile')}>
            {t('removeProfile')}
          </Button>
          <Button variant="primary" onClick={() => console.debug('Save')}>
            {t('save')}
          </Button>
        </div>
      </div>
    </>
  );
}
