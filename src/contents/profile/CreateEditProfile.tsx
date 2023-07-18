import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { accountProfile } from '@/api/chain/profile/query/accountProfile';
import { Profile } from '@/api/models/profile.ts';
import { Button } from '@/components/Button';
import * as Header from '@/components/Header';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import profilePlaceholders from '@/contents/profile/profilePlaceholders';
import { useChain } from '@/hooks/useChain';

interface CreateEditProfileProps {
  create: boolean;
}

export function CreateEditProfile({ create }: CreateEditProfileProps) {
  const { t } = useTranslation();
  const { actor } = useChain();

  const randomProfile = Math.floor(Math.random() * 10);

  const [profile, setProfile] = useState<Profile | null>(null);

  const save = () => {
    if (create) {
      console.debug('Create profile');
    } else {
      console.debug('Edit profile');
    }
  };

  const remove = () => {
    console.debug('Remove profile');
  };

  useEffect(() => {
    accountProfile(actor as string).then(response => {
      setProfile(response);
    });
  }, [actor]);

  return (
    <>
      <Header.Root>
        <Header.Title>{create ? t('createProfile') : t('editProfile')}</Header.Title>
      </Header.Root>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden rounded-xl bg-subtle p-8">
        <Input
          // {...register('imageUrl')}
          // error={errors.imageUrl?.message}
          value={profile?.image_url ?? undefined}
          label={t('avatar') as string}
          placeholder={create ? profilePlaceholders[randomProfile].imageUrl : (t('avatarPlaceholder') as string)}
          maxLength={64}
        />
        <Input
          // {...register('fullName')}
          // error={errors.fullName?.message}
          value={profile?.full_name ?? undefined}
          label={t('fullName') as string}
          placeholder={create ? profilePlaceholders[randomProfile].fullName : (t('fullNamePlaceholder') as string)}
          maxLength={64}
        />
        <TextArea
          // {...register('biography')}
          // error={errors.biography?.message}
          value={profile?.bio ?? undefined}
          label={t('biography') as string}
          placeholder={create ? profilePlaceholders[randomProfile].biography : (t('biographyPlaceholder') as string)}
          rows={3}
          maxLength={256}
        />
        <div className="flex w-full gap-6">
          <div className="flex w-full flex-col gap-6">
            <Input
              // {...register('groupName')}
              // error={errors.groupName?.message}
              value={profile?.group_name ?? undefined}
              label={t('groupName') as string}
              placeholder={
                create ? profilePlaceholders[randomProfile].groupName : (t('groupNamePlaceholder') as string)
              }
              maxLength={64}
            />
            <Input
              // {...register('website')}
              // error={errors.website?.message}
              value={profile?.website ?? undefined}
              placeholder={create ? profilePlaceholders[randomProfile].website : (t('websitePlaceholder') as string)}
              label={t('website') as string}
              maxLength={64}
            />
          </div>
          <div className="flex w-full flex-col gap-6">
            <Input
              // {...register('country')}
              // error={errors.country?.message}
              value={profile?.country ?? undefined}
              placeholder={create ? profilePlaceholders[randomProfile].country : (t('countryPlaceholder') as string)}
              label={t('country') as string}
              maxLength={64}
            />
            <Input
              // {...register('telegram')}
              // error={errors.telegram?.message}
              value={profile?.contact ?? undefined}
              placeholder={
                create ? profilePlaceholders[randomProfile].contact : (t('telegramHandlePlaceholder') as string)
              }
              label={t('telegramHandle') as string}
              maxLength={64}
            />
          </div>
        </div>
        <div className="flex w-full justify-end gap-3">
          {!create ? (
            <Button variant="tertiary" onClick={remove}>
              {t('removeProfile')}
            </Button>
          ) : null}
          <Button variant="primary" onClick={save}>
            {create ? t('create') : t('save')}
          </Button>
        </div>
      </div>
    </>
  );
}
