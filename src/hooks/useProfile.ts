import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { accountProfile } from '@/api/chain/profile';
import { Profile } from '@/api/models/profile';
import { imageExists } from '@/utils/image';

interface useProfileProps {
  actor: string;
}

export function useProfile({ actor }: useProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);

  const { data, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', actor],
    queryFn: () => accountProfile(actor).then(response => response),
    enabled: !!actor,
  });

  useEffect(() => {
    if (!data) return;

    imageExists(data.image_url)
      .then(() => setProfile(data))
      .catch(() => {
        data.image_url = '';
        setProfile(data);
      });
  }, [data]);

  return {
    profile,
    isLoadingProfile,
  };
}
