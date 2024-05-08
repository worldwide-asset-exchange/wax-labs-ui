import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';

import { editProfile, newProfile, removeProfile } from '@/api/chain/profile';
import { accountProfile } from '@/api/chain/profile/query/accountProfile';
import { Profile } from '@/api/models/profile.ts';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import profilePlaceholders from '@/contents/profile/profilePlaceholders';
import { useChain } from '@/hooks/useChain';

const randomProfile = Math.floor(Math.random() * 10);

export function CreateEditProfile() {
  const { t } = useTranslation();
  const { actor, session } = useChain();
  const { pathname } = useLocation();
  const maxBioLength = 256;

  const create = pathname.includes('create');

  const ProfileSchema = useMemo(() => {
    return z.object({
      image_url: z.string().nonempty(t('avatarErrorEmpty')!).max(256),
      full_name: z.string().nonempty(t('fullNameErrorEmpty')!).max(64),
      bio: z.string().nonempty(t('biographyErrorEmpty')!).max(256),
      group_name: z.string().nonempty(t('groupNameErrorEmpty')!).max(64),
      website: z.string().nonempty(t('websiteErrorEmpty')!).max(64),
      country: z.string().nonempty(t('countryErrorEmpty')!).max(64),
      contact: z
        .string()
        .regex(/.*\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/, t('telegramErrorRegex')!)
        .nonempty(t('telegramErrorEmpty')!)
        .max(64),
    });
  }, [t]);

  const save = async (data: Profile) => {
    if (create) {
      await newProfile({ profile: data, session: session! });
    } else {
      await editProfile({ profile: data, session: session! });
    }
    reset();
  };

  const remove = async () => {
    await removeProfile({ session: session! });
  };

  const { data: profile } = useQuery({
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Profile>({ resolver: zodResolver(ProfileSchema), values: profile });

  const bioLength = watch('bio')?.length ?? 0;

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{create ? t('createProfile') : t('editProfile')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        <form onSubmit={handleSubmit(save)} className="space-y-6 rounded-xl bg-subtle p-8">
          <Input
            {...register('image_url')}
            error={errors.image_url?.message}
            label={t('avatar')!}
            placeholder={create ? profilePlaceholders[randomProfile].imageUrl : t('avatarPlaceholder')!}
            maxLength={256}
          />
          <Input
            {...register('full_name')}
            error={errors.full_name?.message}
            label={t('fullName')!}
            placeholder={create ? profilePlaceholders[randomProfile].fullName : t('fullNamePlaceholder')!}
            maxLength={64}
          />
          <TextArea
            {...register('bio')}
            error={errors.bio?.message}
            label={`${t('biography')!} (${bioLength}/${maxBioLength})`}
            placeholder={create ? profilePlaceholders[randomProfile].biography : t('biographyPlaceholder')!}
            rows={3}
            maxLength={maxBioLength}
          />
          <div className="grid gap-6 md:grid-cols-2 md:grid-rows-2">
            <Input
              {...register('group_name')}
              error={errors.group_name?.message}
              label={t('groupName')!}
              placeholder={create ? profilePlaceholders[randomProfile].groupName : t('groupNamePlaceholder')!}
              maxLength={64}
            />
            <Input
              {...register('website')}
              error={errors.website?.message}
              placeholder={create ? profilePlaceholders[randomProfile].website : t('websitePlaceholder')!}
              label={t('website')!}
              maxLength={64}
            />
            <Input
              {...register('country')}
              error={errors.country?.message}
              placeholder={create ? profilePlaceholders[randomProfile].country : t('countryPlaceholder')!}
              label={t('country')!}
              maxLength={64}
            />
            <Input
              {...register('contact')}
              error={errors.contact?.message}
              placeholder={create ? profilePlaceholders[randomProfile].contact : t('telegramPlaceholder')!}
              label={t('telegramHandle')!}
              maxLength={64}
            />
          </div>

          <div className="flex justify-end gap-3">
            {!create ? (
              <Button variant="tertiary" onClick={remove}>
                {t('removeProfile')}
              </Button>
            ) : null}
            <Button variant="primary" type="submit">
              {create ? t('create') : t('save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
