import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Link } from '@/components/Link';
import { ProfileCardSkeleton } from '@/components/ProfileCardSkeleton';
import { useChain } from '@/hooks/useChain.ts';
import { useProfile } from '@/hooks/useProfile';

import { ProfileCard } from './ProfileCard';

export function UserProfile() {
  const { t } = useTranslation();
  const { actor } = useChain();
  const { actor: actorParam } = useParams();

  const { profile, isLoadingProfile } = useProfile({ actor: actorParam as string });

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('profile')}</h2>

      <div className="max-w-5xl px-1 md:px-4">
        {isLoadingProfile ? (
          <ProfileCardSkeleton />
        ) : (
          <>
            {profile ? (
              <ProfileCard
                imageUrl={profile.image_url}
                fullName={profile.full_name}
                actor={profile.wax_account}
                biography={profile.bio}
                groupName={profile.group_name}
                country={profile.country}
                website={profile.website}
                telegram={profile.contact}
              >
                {actor == actorParam && (
                  <Link to={`/${actor}/edit`} variant="secondary">
                    {t('editProfile')}
                  </Link>
                )}
              </ProfileCard>
            ) : (
              <div className="flex w-full items-center justify-between overflow-hidden rounded-xl bg-subtle p-4">
                <p className="subtitle-1 text-low-contrast">
                  {actor == actorParam ? t('noProfile') : t('noUserProfile')}
                </p>
                {actor == actorParam && (
                  <Link to={`/${actor}/create`} variant="primary">
                    {t('createProfile')}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
