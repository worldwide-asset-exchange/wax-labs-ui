import { useTranslation } from 'react-i18next';

import { Link } from '@/components/Link';
import { ProfileCardSkeleton } from '@/components/ProfileCardSkeleton';
import { ProfileCard } from '@/contents/profile/ProfileCard';
import { useProfile } from '@/hooks/useProfile';

interface ProposalDetailProposer {
  proposer: string;
}

export function ProposalDetailProposer({ proposer }: ProposalDetailProposer) {
  const { t } = useTranslation();

  const { profile, isLoadingProfile } = useProfile({ actor: proposer });

  return (
    <>
      <h2 className="title-2 mx-auto mt-8 max-w-5xl px-4 py-8 text-high-contrast">{t('proposer')}</h2>
      <div className="mx-auto max-w-5xl px-1 md:px-4">
        {isLoadingProfile || !profile ? (
          <ProfileCardSkeleton />
        ) : (
          <ProfileCard
            imageUrl={profile.image_url}
            fullName={profile.full_name}
            actor={proposer}
            biography={profile.bio}
            groupName={profile.group_name}
            country={profile.country}
            website={profile.website}
            telegram={profile.contact}
          >
            <Link to={`/${proposer}`} variant="secondary">
              {t('seeProfile')}
            </Link>
          </ProfileCard>
        )}
      </div>
    </>
  );
}
