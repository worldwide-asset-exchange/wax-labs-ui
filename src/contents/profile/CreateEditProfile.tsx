import { Session } from '@wharfkit/session';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { editProfile, newProfile, removeProfile } from '@/api/chain/profile';
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
  const { actor, session } = useChain();

  const randomProfile = Math.floor(Math.random() * 10);

  const save = (data: Profile) => {
    if (create) {
      newProfile({ profile: data, session: session as Session });
    } else {
      editProfile({ profile: data, session: session as Session });
    }
    reset();
  };

  const remove = () => {
    removeProfile({ session: session as Session });
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext<Profile>();

  useEffect(() => {
    accountProfile(actor as string).then(response => {
      if (response) {
        Object.entries(response).forEach(([name, value]) => setValue(name as keyof Profile, value));
      }
    });
  }, [actor, setValue]);

  return (
    <>
      <Header.Root>
        <Header.Title>{create ? t('createProfile') : t('editProfile')}</Header.Title>
      </Header.Root>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden rounded-xl bg-subtle p-8">
        <Input
          {...register('image_url')}
          error={errors.image_url?.message}
          label={t('avatar') as string}
          placeholder={create ? profilePlaceholders[randomProfile].imageUrl : (t('avatarPlaceholder') as string)}
          maxLength={64}
        />
        <Input
          {...register('full_name')}
          error={errors.full_name?.message}
          label={t('fullName') as string}
          placeholder={create ? profilePlaceholders[randomProfile].fullName : (t('fullNamePlaceholder') as string)}
          maxLength={64}
        />
        <TextArea
          {...register('bio')}
          error={errors.bio?.message}
          label={t('biography') as string}
          placeholder={create ? profilePlaceholders[randomProfile].biography : (t('biographyPlaceholder') as string)}
          rows={3}
          maxLength={256}
        />
        <div className="flex w-full gap-6">
          <div className="flex w-full flex-col gap-6">
            <Input
              {...register('group_name')}
              error={errors.group_name?.message}
              label={t('groupName') as string}
              placeholder={
                create ? profilePlaceholders[randomProfile].groupName : (t('groupNamePlaceholder') as string)
              }
              maxLength={64}
            />
            <Input
              {...register('website')}
              error={errors.website?.message}
              placeholder={create ? profilePlaceholders[randomProfile].website : (t('websitePlaceholder') as string)}
              label={t('website') as string}
              maxLength={64}
            />
          </div>
          <div className="flex w-full flex-col gap-6">
            <Input
              {...register('country')}
              error={errors.country?.message}
              placeholder={create ? profilePlaceholders[randomProfile].country : (t('countryPlaceholder') as string)}
              label={t('country') as string}
              maxLength={64}
            />
            <Input
              {...register('contact')}
              error={errors.contact?.message}
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
          <Button variant="primary" onClick={handleSubmit(save)}>
            {create ? t('create') : t('save')}
          </Button>
        </div>
      </div>
    </>
  );
}
